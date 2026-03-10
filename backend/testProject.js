require('dotenv').config();
const mongoose = require('mongoose');
const { generateRiskInsight } = require('./src/services/aiService');

const testProject = async () => {
  console.log('🔍 CYBERSECURITY RISK MANAGEMENT SYSTEM - DIAGNOSTIC TEST\n');
  console.log('=' .repeat(60));

  // 1. Environment Variables
  console.log('\n1️⃣  ENVIRONMENT VARIABLES:');
  console.log('   PORT:', process.env.PORT || '❌ NOT SET');
  console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ SET' : '❌ NOT SET');
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET');
  console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `✅ SET (${process.env.GEMINI_API_KEY.length} chars)` : '❌ NOT SET');

  // 2. Database Connection
  console.log('\n2️⃣  DATABASE CONNECTION:');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('   ✅ MongoDB connected successfully');
    
    const { Risk } = require('./src/models/Risk');
    const riskCount = await Risk.countDocuments();
    console.log(`   ✅ Found ${riskCount} risks in database`);

    // 3. Test AI with sample risk
    console.log('\n3️⃣  AI SERVICE TEST:');
    if (riskCount > 0) {
      const sampleRisk = await Risk.findOne();
      console.log(`   Testing with risk: "${sampleRisk.description.substring(0, 50)}..."`);
      console.log(`   Asset: ${sampleRisk.affectedAsset}`);
      console.log(`   Severity: ${sampleRisk.severity}`);
      console.log(`   Score: ${sampleRisk.riskScore}/25`);
      
      console.log('\n   🤖 Generating AI insight...');
      const startTime = Date.now();
      const insight = await generateRiskInsight(sampleRisk);
      const duration = Date.now() - startTime;
      
      console.log(`   ✅ AI insight generated in ${duration}ms`);
      console.log('\n   📊 INSIGHT PREVIEW:');
      console.log(`   Summary: ${insight.summary.substring(0, 100)}...`);
      console.log(`   Root Cause: ${insight.rootCause.substring(0, 80)}...`);
      console.log(`   Priority: ${insight.priority}`);
      console.log(`   Owner: ${insight.suggestedOwner}`);
      
      // Check if it's personalized
      const hasDescription = insight.summary.toLowerCase().includes(sampleRisk.description.toLowerCase().split(' ')[0]);
      const hasAsset = insight.rootCause.toLowerCase().includes(sampleRisk.affectedAsset.toLowerCase());
      const hasScore = insight.summary.includes(sampleRisk.riskScore.toString());
      
      console.log('\n   🎯 PERSONALIZATION CHECK:');
      console.log(`   ${hasDescription ? '✅' : '⚠️ '} Description referenced in summary`);
      console.log(`   ${hasAsset ? '✅' : '⚠️ '} Asset mentioned in root cause`);
      console.log(`   ${hasScore ? '✅' : '⚠️ '} Risk score included`);
      
    } else {
      console.log('   ⚠️  No risks found. Run "npm run seed" to add sample data');
    }

  } catch (error) {
    console.log('   ❌ Database error:', error.message);
  }

  // 4. Dependencies Check
  console.log('\n4️⃣  DEPENDENCIES:');
  try {
    require('@google/generative-ai');
    console.log('   ✅ @google/generative-ai installed');
    require('express');
    console.log('   ✅ express installed');
    require('mongoose');
    console.log('   ✅ mongoose installed');
    require('jsonwebtoken');
    console.log('   ✅ jsonwebtoken installed');
    require('bcrypt');
    console.log('   ✅ bcrypt installed');
    require('multer');
    console.log('   ✅ multer installed');
    require('xlsx');
    console.log('   ✅ xlsx installed');
  } catch (error) {
    console.log('   ❌ Missing dependency:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ DIAGNOSTIC COMPLETE\n');
  
  process.exit(0);
};

testProject().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
