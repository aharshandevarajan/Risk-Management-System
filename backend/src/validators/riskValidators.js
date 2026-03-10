const { body, param } = require('express-validator');

const THREAT_TYPES = [
  'Phishing',
  'Malware',
  'Data Breach',
  'Insider Threat',
  'Weak Password',
  'Network Attack',
];

const ASSETS = ['Server', 'Database', 'Network', 'Employee Device', 'Web App'];

const STATUSES = ['Open', 'Investigating', 'Mitigated', 'Closed'];

const createRiskRules = [
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('threatType')
    .isIn(THREAT_TYPES)
    .withMessage(`threatType must be one of: ${THREAT_TYPES.join(', ')}`),
  body('affectedAsset')
    .isIn(ASSETS)
    .withMessage(`affectedAsset must be one of: ${ASSETS.join(', ')}`),
  body('likelihood')
    .isInt({ min: 1, max: 5 })
    .withMessage('likelihood must be 1–5')
    .toInt(),
  body('impact')
    .isInt({ min: 1, max: 5 })
    .withMessage('impact must be 1–5')
    .toInt(),
];

const updateRiskRules = [
  param('id').isMongoId().withMessage('Invalid risk ID'),
  body('status')
    .optional()
    .isIn(STATUSES)
    .withMessage(`status must be one of: ${STATUSES.join(', ')}`),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('threatType').optional().isIn(THREAT_TYPES),
  body('affectedAsset').optional().isIn(ASSETS),
  body('likelihood').optional().isInt({ min: 1, max: 5 }),
  body('impact').optional().isInt({ min: 1, max: 5 }),
];

const idParamRule = [param('id').isMongoId().withMessage('Invalid risk ID')];

module.exports = {
  createRiskRules,
  updateRiskRules,
  idParamRule,
};
