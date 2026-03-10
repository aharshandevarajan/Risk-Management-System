const { Readable } = require('stream');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const { Risk } = require('../models/Risk');
const { ROLES } = require('../models/User');
const { analyzeRiskWithAI, predictRiskTrend, generateRiskReport, generateRiskInsight } = require('../services/aiService');

/**
 * Build a simple filter object from query params.
 * Supports severity, status, and threatType filters.
 */
const buildRiskFilters = (query) => {
  const filters = {};

  if (query.severity) {
    filters.severity = query.severity;
  }

  if (query.status) {
    filters.status = query.status;
  }

  if (query.threatType) {
    filters.threatType = query.threatType;
  }

  return filters;
};

/**
 * GET /api/risks
 * Get list of risks.
 * - Admin / Security Analyst: see all
 * - Employee: see only risks they reported
 */
const getRisks = async (req, res, next) => {
  try {
    const filters = buildRiskFilters(req.query);

    if (req.user.role === ROLES.EMPLOYEE) {
      filters.reportedBy = req.user.id;
    }

    // Don't show archived by default
    if (req.query.showArchived !== 'true') {
      filters.archived = { $ne: true };
    }

    const risks = await Risk.find(filters)
      .populate('reportedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(risks);
  } catch (err) {
    next(err);
  }
};

const getRiskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid risk ID format' });
    }

    const risk = await Risk.findById(id)
      .populate('reportedBy', 'name email role');

    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }

    // Check permissions
    if (req.user.role === ROLES.EMPLOYEE && risk.reportedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(risk);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/risks/summary
 * Lightweight dashboard stats for cards & charts.
 */
const getRiskSummary = async (req, res, next) => {
  try {
    const filters = {};
    if (req.user.role === ROLES.EMPLOYEE) {
      filters.reportedBy = req.user.id;
    }

    const allRisks = await Risk.find(filters);

    const total = allRisks.length;
    const open = allRisks.filter((r) => r.status === 'Open').length;
    const closed = allRisks.filter((r) => r.status === 'Closed').length;
    const highSeverity = allRisks.filter((r) => r.severity === 'High').length;

    const severityDistribution = {
      Low: allRisks.filter((r) => r.severity === 'Low').length,
      Medium: allRisks.filter((r) => r.severity === 'Medium').length,
      High: allRisks.filter((r) => r.severity === 'High').length,
    };

    const statusDistribution = {
      Open: allRisks.filter((r) => r.status === 'Open').length,
      Investigating: allRisks.filter((r) => r.status === 'Investigating').length,
      Mitigated: allRisks.filter((r) => r.status === 'Mitigated').length,
      Closed: closed,
    };

    const recent = allRisks
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    res.json({
      total,
      open,
      closed,
      highSeverity,
      severityDistribution,
      statusDistribution,
      recent,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/risks
 * Create a new risk entry.
 * Any authenticated user can report risks.
 */
const createRisk = async (req, res, next) => {
  try {
    const { threatType, description, affectedAsset, likelihood, impact } = req.body;

    const payload = {
      threatType,
      description,
      affectedAsset,
      likelihood,
      impact,
      reportedBy: req.user.id,
    };

    const risk = await Risk.create(payload);

    // AI Analysis
    const aiAnalysis = await analyzeRiskWithAI(risk);
    if (aiAnalysis) {
      risk.aiAnalysis = aiAnalysis;
      await risk.save();
    }

    res.status(201).json(risk);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/risks/:id
 * Update a risk.
 * - Admin / Security Analyst: can update any risk
 * - Employee: can only update their own risks
 */
const updateRisk = async (req, res, next) => {
  try {
    const risk = await Risk.findById(req.params.id);

    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }

    if (
      req.user.role === ROLES.EMPLOYEE &&
      risk.reportedBy.toString() !== req.user.id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'You can only update risks you have reported' });
    }

    const updated = await Risk.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/risks/:id
 * Only Admins can delete risks.
 */
const deleteRisk = async (req, res, next) => {
  try {
    const risk = await Risk.findById(req.params.id);

    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }

    await risk.deleteOne();

    res.json({ message: 'Risk deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/risks/import
 * Import risks from a CSV upload.
 * Only Admin / Security Analyst should be allowed to call this.
 *
 * Expected CSV headers:
 * description,affectedAsset,threatType,likelihood,impact,severity,status
 */
const importRisksFromCsv = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const records = [];
    const fileName = req.file.originalname.toLowerCase();
    let rawData = [];

    // Check if Excel file
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rawData = XLSX.utils.sheet_to_json(sheet);
    } else {
      // CSV processing
      const readable = Readable.from(req.file.buffer.toString());

      await new Promise((resolve, reject) => {
        readable
          .pipe(csv())
          .on('data', (row) => rawData.push(row))
          .on('end', resolve)
          .on('error', reject);
      });
    }

    console.log('Parsed rows:', rawData.length);
    console.log('First row:', rawData[0]);

    // Process each row
    rawData.forEach((row, index) => {
      // Try to find description field (case insensitive)
      const descKey = Object.keys(row).find(k => k.toLowerCase().includes('desc'));
      const likelihoodKey = Object.keys(row).find(k => k.toLowerCase().includes('likelihood'));
      const impactKey = Object.keys(row).find(k => k.toLowerCase().includes('impact'));
      const assetKey = Object.keys(row).find(k => k.toLowerCase().includes('asset'));
      const threatKey = Object.keys(row).find(k => k.toLowerCase().includes('threat'));
      const statusKey = Object.keys(row).find(k => k.toLowerCase().includes('status'));

      const description = descKey ? row[descKey] : Object.values(row)[0];
      const likelihood = likelihoodKey ? Number(row[likelihoodKey]) : 3;
      const impact = impactKey ? Number(row[impactKey]) : 3;
      const affectedAsset = assetKey ? row[assetKey] : 'Server';
      const threatType = threatKey ? row[threatKey] : 'Data Breach';
      const status = statusKey ? row[statusKey] : 'Open';

      if (description && String(description).trim()) {
        records.push({
          description: String(description).trim(),
          affectedAsset: affectedAsset || 'Server',
          threatType: threatType || 'Data Breach',
          likelihood: likelihood || 3,
          impact: impact || 3,
          status: status || 'Open',
          reportedBy: req.user.id,
        });
      }
    });

    console.log('Valid records:', records.length);

    if (records.length === 0) {
      return res.status(400).json({ 
        message: 'No valid rows found. Check your file has data in the first column.',
        columns: rawData[0] ? Object.keys(rawData[0]) : []
      });
    }

    const result = await Risk.insertMany(records, { ordered: false });

    res.status(201).json({ imported: result.length });
  } catch (err) {
    console.error('Import error:', err);
    next(err);
  }
};

/**
 * GET /api/risks/export
 * Stream all risks as a CSV file for reporting.
 */
const exportRisksToCsv = async (req, res, next) => {
  try {
    const risks = await Risk.find().populate('reportedBy', 'email');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="risks-export.csv"'
    );

    const escape = (value) =>
      `"${(value ?? '').toString().replace(/"/g, '""')}"`;

    res.write(
      'description,affectedAsset,threatType,likelihood,impact,riskScore,severity,status,reportedByEmail\n'
    );

    for (const risk of risks) {
      res.write(
        [
          escape(risk.description),
          escape(risk.affectedAsset),
          escape(risk.threatType),
          risk.likelihood ?? '',
          risk.impact ?? '',
          risk.riskScore ?? '',
          escape(risk.severity),
          escape(risk.status),
          escape(risk.reportedBy?.email || ''),
        ].join(',') + '\n'
      );
    }

    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRisks,
  getRiskSummary,
  createRisk,
  updateRisk,
  deleteRisk,
  importRisksFromCsv,
  exportRisksToCsv,
};


const getAITrends = async (req, res, next) => {
  try {
    const filters = {};
    if (req.user.role === ROLES.EMPLOYEE) {
      filters.reportedBy = req.user.id;
    }

    const risks = await Risk.find(filters).sort({ createdAt: -1 }).limit(50);
    const trends = await predictRiskTrend(risks);

    const total = risks.length;
    const highSeverity = risks.filter((r) => r.severity === 'High').length;
    const openCount = risks.filter((r) => r.status === 'Open' || r.status === 'Investigating').length;
    const now = Date.now();
    const updatedLast24h = risks.filter(
      (r) => now - new Date(r.updatedAt).getTime() <= 24 * 60 * 60 * 1000
    ).length;

    res.json({
      trend: trends?.trend || 'Stable',
      vulnerableAreas: Array.isArray(trends?.vulnerableAreas) ? trends.vulnerableAreas : [],
      predictions: Array.isArray(trends?.predictions) ? trends.predictions : [],
      recommendations: Array.isArray(trends?.recommendations) ? trends.recommendations : [],
      lastUpdated: new Date().toISOString(),
      metrics: {
        total,
        highSeverity,
        openCount,
        updatedLast24h,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAIReport = async (req, res, next) => {
  try {
    const filters = {};
    if (req.user.role === ROLES.EMPLOYEE) {
      filters.reportedBy = req.user.id;
    }

    const risks = await Risk.find(filters).sort({ createdAt: -1 });
    const report = await generateRiskReport(risks);

    res.json({ report });
  } catch (err) {
    next(err);
  }
};

const analyzeRisk = async (req, res, next) => {
  try {
    const risk = await Risk.findById(req.params.id);
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }

    const analysis = await analyzeRiskWithAI(risk);
    res.json(analysis || { message: 'AI analysis unavailable' });
  } catch (err) {
    next(err);
  }
};

const archiveRisk = async (req, res, next) => {
  try {
    const risk = await Risk.findById(req.params.id);
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }

    risk.archived = true;
    risk.archivedAt = new Date();
    await risk.save();

    res.json({ message: 'Risk archived successfully', risk });
  } catch (err) {
    next(err);
  }
};

const unarchiveRisk = async (req, res, next) => {
  try {
    const risk = await Risk.findById(req.params.id);
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }

    risk.archived = false;
    risk.archivedAt = null;
    await risk.save();

    res.json({ message: 'Risk unarchived successfully', risk });
  } catch (err) {
    next(err);
  }
};

const getRiskInsight = async (req, res, next) => {
  try {
    const risk = await Risk.findById(req.params.id);
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }

    // Check if cached insight exists and is recent (< 24 hours)
    if (risk.aiInsight && risk.aiInsight.generatedAt) {
      const hoursSinceGenerated = (Date.now() - new Date(risk.aiInsight.generatedAt).getTime()) / (1000 * 60 * 60);
      if (hoursSinceGenerated < 24) {
        return res.json({ insight: risk.aiInsight, cached: true });
      }
    }

    // Generate new insight
    const insight = await generateRiskInsight(risk);
    
    // Cache the insight
    risk.aiInsight = insight;
    await risk.save();

    res.json({ insight, cached: false });
  } catch (err) {
    next(err);
  }
};

const regenerateRiskInsight = async (req, res, next) => {
  try {
    const risk = await Risk.findById(req.params.id);
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }

    // Force regenerate
    const insight = await generateRiskInsight(risk);
    
    // Update cache
    risk.aiInsight = insight;
    await risk.save();

    res.json({ insight, cached: false });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRisks,
  getRiskById,
  getRiskSummary,
  createRisk,
  updateRisk,
  deleteRisk,
  importRisksFromCsv,
  exportRisksToCsv,
  getAITrends,
  getAIReport,
  analyzeRisk,
  archiveRisk,
  unarchiveRisk,
  getRiskInsight,
  regenerateRiskInsight,
};
