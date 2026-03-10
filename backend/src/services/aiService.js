const { GoogleGenerativeAI } = require('@google/generative-ai');

const hasValidApiKey = () =>
  Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length >= 20);

const getModel = () => {
  if (!hasValidApiKey()) return null;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
};

const parseJsonFromModelText = (text) => {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  return JSON.parse(jsonMatch[0]);
};

const generateRiskInsight = async (risk) => {
  try {
    const model = getModel();
    if (!model) throw new Error('Gemini key not configured');

    const prompt = `You are a professional cybersecurity analyst. Analyze this specific risk in detail.

RISK DETAILS:
- Description: ${risk.description}
- Threat Type: ${risk.threatType}
- Affected Asset: ${risk.affectedAsset}
- Likelihood Score: ${risk.likelihood}/5
- Impact Score: ${risk.impact}/5
- Risk Score: ${risk.riskScore}/25
- Severity Level: ${risk.severity}

Return only valid JSON:
{
  "summary": "2-3 sentence analysis",
  "rootCause": "Specific technical cause",
  "businessImpact": "Business impact for this asset",
  "probabilityExplanation": "Why this likelihood is appropriate",
  "mitigation": "Numbered list of five specific actions",
  "prevention": "Long-term prevention strategy",
  "priority": "Priority with timeline",
  "suggestedOwner": "Responsible team"
}`;

    const result = await model.generateContent(prompt);
    const insight = parseJsonFromModelText(result.response.text());
    if (!insight) throw new Error('Model did not return JSON');

    insight.generatedAt = new Date();
    return insight;
  } catch (error) {
    return generateFallbackInsight(risk);
  }
};

const generateFallbackInsight = (risk) => {
  const desc = risk.description || 'Security risk';
  const asset = risk.affectedAsset || 'System';
  const score = risk.riskScore || 0;
  const severity = risk.severity || 'Medium';
  const likelihood = risk.likelihood || 3;
  const impact = risk.impact || 3;

  const threatData = {
    Phishing: {
      root: `Email-based attack targeting ${asset}. The description "${desc}" indicates social engineering tactics.`,
      mitigation: `1. Enable anti-phishing filters for ${asset}\n2. Enforce MFA for users\n3. Add domain spoofing controls\n4. Train users with simulations\n5. Monitor high-risk mailbox activity`,
      owner: `${asset} Security Team`,
    },
    Malware: {
      root: `Malicious software risk to ${asset}. The event "${desc}" suggests endpoint compromise potential.`,
      mitigation: `1. Isolate affected hosts\n2. Run EDR containment playbook\n3. Patch exploitable software\n4. Refresh signatures and IOC rules\n5. Validate recovery integrity`,
      owner: `${asset} Operations Team`,
    },
    'Data Breach': {
      root: `Data exposure risk on ${asset}. The incident "${desc}" suggests unauthorized access or data leakage.`,
      mitigation: `1. Audit access logs\n2. Rotate secrets and keys\n3. Enable strict data access policies\n4. Encrypt sensitive stores\n5. Add data exfiltration monitoring`,
      owner: `${asset} Data Protection Team`,
    },
    'Network Attack': {
      root: `Network-level threat targeting ${asset}. The pattern "${desc}" indicates intrusion/disruption attempts.`,
      mitigation: `1. Segment network zones\n2. Harden firewall rules\n3. Deploy IDS/IPS signatures\n4. Rate-limit exposed services\n5. Enable anomaly monitoring`,
      owner: `${asset} Network Security Team`,
    },
    'Insider Threat': {
      root: `Internal abuse/misuse risk on ${asset}. The case "${desc}" indicates privilege misuse potential.`,
      mitigation: `1. Review privilege assignments\n2. Enable behavior analytics\n3. Add approval for sensitive actions\n4. Increase audit logging\n5. Run access recertification`,
      owner: `${asset} Compliance Team`,
    },
    'Weak Password': {
      root: `Authentication weakness on ${asset}. The issue "${desc}" indicates inadequate credential controls.`,
      mitigation: `1. Force credential reset\n2. Enforce MFA\n3. Add strong password policy\n4. Block breached passwords\n5. Enable login anomaly detection`,
      owner: `${asset} Identity Team`,
    },
  };

  const data = threatData[risk.threatType] || threatData['Data Breach'];

  let priority;
  if (severity === 'High' || score >= 15) {
    priority = 'Critical - immediate response (0-24 hours)';
  } else if (severity === 'Medium' || score >= 9) {
    priority = 'High - address within 72 hours';
  } else {
    priority = 'Medium - resolve within 7 days';
  }

  const impactLevel = impact >= 4 ? 'severe' : impact >= 3 ? 'significant' : 'moderate';

  return {
    summary: `${severity} ${risk.threatType} risk affecting ${asset} (score ${score}/25). This requires prioritized mitigation and monitoring.`,
    rootCause: data.root,
    businessImpact: `This event can cause ${impactLevel} disruption to ${asset}, including downtime, potential compliance impact, and financial loss.`,
    probabilityExplanation: `Likelihood ${likelihood}/5 is based on current exposure of ${asset}, control maturity, and the incident details: "${desc}".`,
    mitigation: data.mitigation,
    prevention: `Adopt continuous monitoring, regular hardening, access governance, and quarterly tabletop exercises for ${asset}.`,
    priority,
    suggestedOwner: data.owner,
    generatedAt: new Date(),
  };
};

const analyzeRiskWithAI = async (riskData) => {
  try {
    const model = getModel();
    if (!model) return null;

    const prompt = `Analyze ${riskData.threatType} on ${riskData.affectedAsset}. Return JSON:
{"severity":"string","mitigation":["step1","step2"],"impact":"string","timeToResolve":"string","aiConfidence":80}`;
    const result = await model.generateContent(prompt);
    return parseJsonFromModelText(result.response.text());
  } catch {
    return null;
  }
};

const buildFallbackTrend = (risks) => {
  if (!Array.isArray(risks) || risks.length === 0) {
    return {
      trend: 'Stable',
      vulnerableAreas: ['No critical concentration detected'],
      predictions: ['Maintain current controls and monitoring cadence'],
      recommendations: ['Continue periodic review of new risks'],
    };
  }

  const byAsset = {};
  const byThreat = {};
  const highCount = risks.filter((r) => r.severity === 'High').length;

  for (const risk of risks) {
    byAsset[risk.affectedAsset] = (byAsset[risk.affectedAsset] || 0) + 1;
    byThreat[risk.threatType] = (byThreat[risk.threatType] || 0) + 1;
  }

  const topAssets = Object.entries(byAsset)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([asset]) => asset);
  const topThreats = Object.entries(byThreat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([threat]) => threat);

  const trend = highCount >= Math.max(2, Math.ceil(risks.length * 0.3)) ? 'Elevated' : 'Stable';

  return {
    trend,
    vulnerableAreas: topAssets.length > 0 ? topAssets : ['General infrastructure'],
    predictions: [
      `Top recurring threats: ${topThreats.join(', ') || 'mixed'}.`,
      `Risk pressure on: ${topAssets.join(', ') || 'core systems'}.`,
    ],
    recommendations: [
      'Increase monitoring on top vulnerable assets.',
      'Prioritize remediation for recurring high-severity threat types.',
      'Review control effectiveness monthly and tune detection rules.',
    ],
  };
};

const normalizeTrendPayload = (payload, risks) => {
  const fallback = buildFallbackTrend(risks);
  if (!payload || typeof payload !== 'object') return fallback;

  const safeList = (value, fallbackList) => {
    if (!Array.isArray(value)) return fallbackList;
    const cleaned = value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
    return cleaned.length > 0 ? cleaned : fallbackList;
  };

  return {
    trend: typeof payload.trend === 'string' && payload.trend.trim() ? payload.trend.trim() : fallback.trend,
    vulnerableAreas: safeList(payload.vulnerableAreas, fallback.vulnerableAreas),
    predictions: safeList(payload.predictions, fallback.predictions),
    recommendations: safeList(payload.recommendations, fallback.recommendations),
  };
};

const predictRiskTrend = async (risks) => {
  try {
    const model = getModel();
    if (!model) return buildFallbackTrend(risks);

    const summary = risks
      .slice(0, 25)
      .map((r) => `${r.threatType}:${r.severity}:${r.affectedAsset}`)
      .join(', ');
    const prompt = `Analyze cybersecurity risk trends from this summary:
${summary}

Return JSON:
{"trend":"string","vulnerableAreas":["area1"],"predictions":["pred1"],"recommendations":["rec1"]}`;

    const result = await model.generateContent(prompt);
    const parsed = parseJsonFromModelText(result.response.text());
    return normalizeTrendPayload(parsed, risks);
  } catch {
    return buildFallbackTrend(risks);
  }
};

const buildFallbackReport = (risks) => {
  const total = risks.length;
  const high = risks.filter((r) => r.severity === 'High').length;
  const medium = risks.filter((r) => r.severity === 'Medium').length;
  const open = risks.filter((r) => r.status === 'Open' || r.status === 'Investigating').length;

  const assetCounts = risks.reduce((acc, r) => {
    acc[r.affectedAsset] = (acc[r.affectedAsset] || 0) + 1;
    return acc;
  }, {});
  const topAsset = Object.entries(assetCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'core systems';

  return [
    `Current portfolio includes ${total} tracked risks, with ${high} high-severity and ${medium} medium-severity cases. ${open} risks are currently open or under investigation, indicating ongoing operational load for the response team.`,
    `Primary exposure concentration is around ${topAsset}. Immediate focus should remain on high-severity containment, closure of aged open items, and tighter preventive controls for repeated threat patterns.`,
  ].join('\n\n');
};

const generateRiskReport = async (risks) => {
  try {
    const model = getModel();
    if (!model) return buildFallbackReport(risks);

    const total = risks.length;
    const high = risks.filter((r) => r.severity === 'High').length;
    const open = risks.filter((r) => r.status === 'Open' || r.status === 'Investigating').length;
    const prompt = `Generate a concise executive cybersecurity report in 2 paragraphs.
Use:
- Total risks: ${total}
- High severity: ${high}
- Open/investigating: ${open}
Focus on exposure posture and immediate priorities.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text()?.trim();
    return text || buildFallbackReport(risks);
  } catch {
    return buildFallbackReport(risks);
  }
};

module.exports = {
  generateRiskInsight,
  analyzeRiskWithAI,
  predictRiskTrend,
  generateRiskReport,
};
