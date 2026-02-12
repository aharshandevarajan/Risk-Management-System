const mongoose = require('mongoose');

const THREAT_TYPES = [
  'Phishing',
  'Malware',
  'Data Breach',
  'Insider Threat',
  'Weak Password',
  'Network Attack',
];

const AFFECTED_ASSETS = [
  'Server',
  'Database',
  'Network',
  'Employee Device',
  'Web App',
];

const STATUSES = ['Open', 'Investigating', 'Mitigated', 'Closed'];

const riskSchema = new mongoose.Schema(
  {
    threatType: {
      type: String,
      enum: THREAT_TYPES,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    affectedAsset: {
      type: String,
      enum: AFFECTED_ASSETS,
      required: true,
    },
    likelihood: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    impact: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    riskScore: {
      type: Number,
      required: true,
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'Open',
    },
    archived: {
      type: Boolean,
      default: false,
    },
    archivedAt: {
      type: Date,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    aiAnalysis: {
      severity: String,
      mitigation: [String],
      impact: String,
      timeToResolve: String,
      aiConfidence: Number,
    },
    aiInsight: {
      summary: String,
      rootCause: String,
      businessImpact: String,
      probabilityExplanation: String,
      mitigation: String,
      prevention: String,
      priority: String,
      suggestedOwner: String,
      generatedAt: Date,
    },
  },
  { timestamps: true }
);

// Helper to calculate score + severity
function calculateRiskFields(doc) {
  // Safely coerce to numbers in case values arrive as strings
  const likelihood = Number(doc.likelihood);
  const impact = Number(doc.impact);

  if (!Number.isFinite(likelihood) || !Number.isFinite(impact)) {
    return;
  }

  const riskScore = likelihood * impact;
  let severity = 'Low';

  if (riskScore >= 13) {
    severity = 'High';
  } else if (riskScore >= 6) {
    severity = 'Medium';
  }

  // Ensure fields on the document are normalized
  doc.likelihood = likelihood;
  doc.impact = impact;
  doc.riskScore = riskScore;
  doc.severity = severity;
}

// Before validating a new/updated document, ensure derived fields are set
// Keep this synchronous and do NOT use `next` to avoid Mongoose 8 async hook issues
riskSchema.pre('validate', function () {
  calculateRiskFields(this);
});

// When using findOneAndUpdate we need to recalc on the update payload
riskSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (!update) return next();

  // Support both direct fields and $set operator
  const target = update.$set || update;
  if (target.likelihood != null || target.impact != null) {
    const temp = {
      likelihood:
        target.likelihood != null ? target.likelihood : this._conditions.likelihood,
      impact: target.impact != null ? target.impact : this._conditions.impact,
    };
    calculateRiskFields(temp);
    target.likelihood = temp.likelihood;
    target.impact = temp.impact;
    target.riskScore = temp.riskScore;
    target.severity = temp.severity;
    if (update.$set) {
      update.$set = target;
    } else {
      Object.assign(update, target);
    }
  }

  next();
});

const Risk = mongoose.model('Risk', riskSchema);

module.exports = {
  Risk,
  THREAT_TYPES,
  AFFECTED_ASSETS,
  STATUSES,
};

