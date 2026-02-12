const express = require('express');
const {
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
} = require('../controllers/riskController');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { ROLES } = require('../models/User');
const multer = require('multer');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for safety
});

// All risk routes require authentication
router.use(authenticate);

// AI-powered endpoints
router.get('/ai/trends', getAITrends);
router.get('/ai/report', getAIReport);
router.get('/:id/analyze', analyzeRisk);

// Summary for dashboard
router.get('/summary', getRiskSummary);

// CSV import (Admin / Security Analyst only)
router.post(
  '/import',
  authorizeRoles(ROLES.ADMIN, ROLES.ANALYST),
  upload.single('file'),
  importRisksFromCsv
);

// CSV export (Admin / Security Analyst only)
router.get(
  '/export',
  authorizeRoles(ROLES.ADMIN, ROLES.ANALYST),
  exportRisksToCsv
);

// CRUD operations
router
  .route('/')
  .get(getRisks)
  .post(createRisk);

// Get single risk by ID
router.get('/:id', getRiskById);

router
  .route('/:id')
  .put(authorizeRoles(ROLES.ADMIN, ROLES.ANALYST, ROLES.EMPLOYEE), updateRisk)
  .delete(authorizeRoles(ROLES.ADMIN), deleteRisk);

router.put('/:id/archive', authorizeRoles(ROLES.ADMIN, ROLES.ANALYST), archiveRisk);
router.put('/:id/unarchive', authorizeRoles(ROLES.ADMIN, ROLES.ANALYST), unarchiveRisk);

// AI Insight endpoints
router.get('/:id/ai-insight', getRiskInsight);
router.post('/:id/ai-insight/regenerate', regenerateRiskInsight);

module.exports = router;

