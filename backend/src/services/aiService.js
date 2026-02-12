const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const generateRiskInsight = async (risk) => {
  // Try AI first
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.length < 20) {
      throw new Error('Invalid API key');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are a professional cybersecurity analyst. Analyze this SPECIFIC risk in detail:

RISK DETAILS:
- Description: ${risk.description}
- Threat Type: ${risk.threatType}
- Affected Asset: ${risk.affectedAsset}
- Likelihood Score: ${risk.likelihood}/5
- Impact Score: ${risk.impact}/5
- Risk Score: ${risk.riskScore}/25
- Severity Level: ${risk.severity}

Provide a DETAILED, SPECIFIC analysis based on the exact description and asset mentioned above. DO NOT give generic responses.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "summary": "2-3 sentences explaining THIS SPECIFIC risk based on the description '${risk.description}' affecting '${risk.affectedAsset}'",
  "rootCause": "Technical root cause analysis specific to '${risk.description}' and '${risk.affectedAsset}'",
  "businessImpact": "Business impact specific to '${risk.affectedAsset}' with risk score ${risk.riskScore}/25",
  "probabilityExplanation": "Detailed explanation why this specific risk has ${risk.likelihood}/5 likelihood based on the description",
  "mitigation": "Numbered list of 5 specific mitigation steps for '${risk.description}' on '${risk.affectedAsset}'",
  "prevention": "Long-term prevention strategy tailored to this ${risk.threatType} threat on ${risk.affectedAsset}",
  "priority": "Priority level (Critical/High/Medium/Low) with timeline based on ${risk.severity} severity and ${risk.riskScore}/25 score",
  "suggestedOwner": "Specific team name responsible for ${risk.affectedAsset}"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const insight = JSON.parse(jsonMatch[0]);
      insight.generatedAt = new Date();
      console.log('✓ AI generated insight for:', risk.description.substring(0, 50));
      return insight;
    }
    throw new Error('No JSON found');
  } catch (error) {
    console.log('AI failed, using fallback:', error.message);
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

  // Generate specific insights based on threat type and description
  const threatData = {
    'Phishing': {
      root: `Email-based attack targeting ${asset}. The description "${desc}" indicates social engineering tactics exploiting user trust and lack of security awareness.`,
      mitigation: `1. Implement advanced email filtering for ${asset}\n2. Deploy anti-phishing tools with URL scanning\n3. Conduct targeted security training for ${asset} users\n4. Enable DMARC/SPF/DKIM authentication\n5. Set up incident response for phishing attempts on ${asset}`,
      owner: `${asset} Security Team`
    },
    'Malware': {
      root: `Malicious software threat to ${asset}. Based on "${desc}", this indicates potential endpoint compromise requiring immediate containment.`,
      mitigation: `1. Isolate ${asset} from network immediately\n2. Deploy EDR solution on ${asset}\n3. Perform full malware scan and forensics\n4. Update antivirus signatures for ${asset}\n5. Patch vulnerabilities on ${asset} systems`,
      owner: `${asset} Operations Team`
    },
    'Data Breach': {
      root: `Data exposure risk on ${asset}. The incident "${desc}" suggests unauthorized access or data leakage requiring urgent investigation.`,
      mitigation: `1. Audit all access logs for ${asset}\n2. Implement DLP controls on ${asset}\n3. Encrypt sensitive data on ${asset} (AES-256)\n4. Review and restrict ${asset} permissions\n5. Deploy monitoring for ${asset} data flows`,
      owner: `${asset} Data Protection Team`
    },
    'Network Attack': {
      root: `Network-level threat targeting ${asset}. The attack pattern "${desc}" indicates potential intrusion or service disruption.`,
      mitigation: `1. Enable IDS/IPS for ${asset} network segment\n2. Implement network segmentation around ${asset}\n3. Close unnecessary ports on ${asset}\n4. Deploy next-gen firewall for ${asset}\n5. Monitor ${asset} traffic for anomalies`,
      owner: `${asset} Network Security Team`
    },
    'Insider Threat': {
      root: `Internal security risk involving ${asset}. The situation "${desc}" suggests privilege misuse or unauthorized activity requiring investigation.`,
      mitigation: `1. Review ${asset} access permissions immediately\n2. Deploy user behavior analytics for ${asset}\n3. Implement privileged access management on ${asset}\n4. Enable detailed audit logging for ${asset}\n5. Conduct security interview regarding ${asset} access`,
      owner: `${asset} Compliance Team`
    },
    'Weak Password': {
      root: `Authentication weakness on ${asset}. The issue "${desc}" indicates inadequate password controls exposing ${asset} to unauthorized access.`,
      mitigation: `1. Force password reset for ${asset} accounts\n2. Implement MFA on ${asset} immediately\n3. Deploy password manager for ${asset} users\n4. Enforce strong password policy on ${asset}\n5. Scan ${asset} credentials against breach databases`,
      owner: `${asset} Identity Management Team`
    }
  };

  const data = threatData[risk.threatType] || threatData['Data Breach'];
  
  // Calculate priority based on actual score and severity
  let priority;
  if (severity === 'High' || score >= 15) {
    priority = 'Critical - Immediate action required (0-24 hours)';
  } else if (severity === 'Medium' || score >= 9) {
    priority = 'High - Address within 72 hours';
  } else {
    priority = 'Medium - Resolve within 1 week';
  }

  // Generate specific business impact
  const impactLevel = impact >= 4 ? 'severe' : impact >= 3 ? 'significant' : 'moderate';
  const financialRange = impact >= 4 ? '$100K-$1M' : impact >= 3 ? '$50K-$500K' : '$10K-$100K';

  return {
    summary: `${severity} severity ${risk.threatType} affecting ${asset} (Risk Score: ${score}/25). The incident "${desc.substring(0, 100)}" poses ${impactLevel} risk with ${likelihood}/5 likelihood requiring immediate attention.`,
    rootCause: data.root,
    businessImpact: `This ${risk.threatType} on ${asset} could result in ${impactLevel} business disruption. Potential financial impact: ${financialRange}. Operational impact includes ${asset} downtime, data integrity concerns, compliance violations (GDPR/HIPAA/SOX), and reputational damage. Impact score of ${impact}/5 indicates ${impactLevel} consequences.`,
    probabilityExplanation: `Likelihood rated ${likelihood}/5 based on: (1) Current threat landscape for ${risk.threatType}, (2) ${asset} exposure level and attack surface, (3) Existing security controls on ${asset}, (4) Historical incident patterns. The description "${desc}" indicates ${likelihood >= 4 ? 'high probability' : likelihood >= 3 ? 'moderate probability' : 'lower probability'} of occurrence.`,
    mitigation: data.mitigation,
    prevention: `Long-term strategy for ${asset}: (1) Implement Zero Trust architecture for ${asset} access, (2) Deploy 24/7 SIEM monitoring for ${asset}, (3) Conduct quarterly security assessments of ${asset}, (4) Establish incident response playbook for ${risk.threatType} on ${asset}, (5) Maintain continuous security training for ${asset} users, (6) Regular vulnerability scanning of ${asset}, (7) Implement defense-in-depth controls around ${asset}.`,
    priority: priority,
    suggestedOwner: data.owner,
    generatedAt: new Date()
  };
};

const analyzeRiskWithAI = async (riskData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Analyze: ${riskData.threatType} on ${riskData.affectedAsset}. Return JSON: {"severity":"string","mitigation":["step1","step2"],"impact":"string","timeToResolve":"string","aiConfidence":80}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    return null;
  }
};

const predictRiskTrend = async (risks) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const summary = risks.slice(0, 10).map(r => `${r.threatType}:${r.severity}`).join(',');
    const prompt = `Analyze trends: ${summary}. Return JSON: {"trend":"string","vulnerableAreas":["area1"],"predictions":["pred1"],"recommendations":["rec1"]}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    return null;
  }
};

const generateRiskReport = async (risks) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Generate executive summary for ${risks.length} risks, ${risks.filter(r => r.severity === 'High').length} high severity. Write 2 professional paragraphs.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return 'Unable to generate report at this time.';
  }
};

module.exports = {
  generateRiskInsight,
  analyzeRiskWithAI,
  predictRiskTrend,
  generateRiskReport
};
