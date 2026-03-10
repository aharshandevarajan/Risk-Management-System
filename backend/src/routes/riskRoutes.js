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
const { validate } = require('../middleware/validate');
const { createRiskRules, updateRiskRules } = require('../validators/riskValidators');
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
  .post(createRiskRules, validate, createRisk);

// Specific ID routes (must be before generic /:id routes)
router.get('/:id/analyze', analyzeRisk);
router.get('/:id/ai-insight', getRiskInsight);
router.post('/:id/ai-insight/regenerate', regenerateRiskInsight);
router.put('/:id/archive', authorizeRoles(ROLES.ADMIN, ROLES.ANALYST), archiveRisk);
router.put('/:id/unarchive', authorizeRoles(ROLES.ADMIN, ROLES.ANALYST), unarchiveRisk);

// Generic ID routes (must be last)
router.get('/:id', getRiskById);
router.put('/:id', authorizeRoles(ROLES.ADMIN, ROLES.ANALYST, ROLES.EMPLOYEE), updateRiskRules, validate, updateRisk);
router.delete('/:id', authorizeRoles(ROLES.ADMIN), deleteRisk);

module.exports = router;

