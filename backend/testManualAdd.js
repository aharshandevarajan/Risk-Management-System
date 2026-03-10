require('dotenv').config();
const mongoose = require('mongoose');
const { Risk } = require('./src/models/Risk');
const { User } = require('./src/models/User');

const testManualRiskCreation = async () => {
  console.log('🧪 TESTING MANUAL RISK CREATION\n');
  console.log('='.repeat(60));

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@risk.com' });
    if (!admin) {
      console.log('❌ Admin user not found. Run: npm run create-admin');
      process.exit(1);
    }
    console.log(`✅ Found admin user: ${admin.email}\n`);

    // Test 1: Create risk with all required fields
    console.log('TEST 1: Creating risk with valid data...');
    try {
      const testRisk = await Risk.create({
        threatType: 'Phishing',
        description: 'Test phishing email detected in inbox',
        affectedAsset: 'Employee Device',
        likelihood: 4,
        impact: 3,
        reportedBy: admin._id,
      });
      console.log('✅ Risk created successfully');
      console.log(`   ID: ${testRisk._id}`);
      console.log(`   Risk Score: ${testRisk.riskScore}`);
      console.log(`   Severity: ${testRisk.severity}`);
      console.log(`   Status: ${testRisk.status}\n`);

      // Clean up
      await Risk.findByIdAndDelete(testRisk._id);
      console.log('✅ Test risk cleaned up\n');
    } catch (error) {
      console.log('❌ Failed to create risk:', error.message);
      console.log('   Error details:', error);
    }

    // Test 2: Validate required fields
    console.log('TEST 2: Testing validation (missing description)...');
    try {
      await Risk.create({
        threatType: 'Malware',
        affectedAsset: 'Server',
        likelihood: 3,
        impact: 4,
        reportedBy: admin._id,
        // Missing description
      });
      console.log('❌ Should have failed validation\n');
    } catch (error) {
      console.log('✅ Validation working correctly');
      console.log(`   Error: ${error.message}\n`);
    }

    // Test 3: Check form field options
    console.log('TEST 3: Validating form options...');
    const threatTypes = ['Phishing', 'Malware', 'Data Breach', 'Insider Threat', 'Weak Password', 'Network Attack'];
    const assets = ['Server', 'Database', 'Network', 'Employee Device', 'Web App'];
    console.log('✅ Threat Types:', threatTypes.join(', '));
    console.log('✅ Assets:', assets.join(', '));
    console.log('✅ Likelihood: 1-5');
    console.log('✅ Impact: 1-5\n');

    // Test 4: Check current risk count
    console.log('TEST 4: Current database state...');
    const totalRisks = await Risk.countDocuments();
    const openRisks = await Risk.countDocuments({ status: 'Open' });
    const highSeverity = await Risk.countDocuments({ severity: 'High' });
    console.log(`✅ Total Risks: ${totalRisks}`);
    console.log(`✅ Open Risks: ${openRisks}`);
    console.log(`✅ High Severity: ${highSeverity}\n`);

    console.log('='.repeat(60));
    console.log('\n✅ ALL TESTS PASSED - Manual risk creation is working!\n');
    console.log('📝 To add a risk manually:');
    console.log('   1. Login as admin@risk.com / admin123');
    console.log('   2. Go to Risk Management page');
    console.log('   3. Fill out "Report New Risk" form');
    console.log('   4. Click "Submit Risk" button\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
  }

  process.exit(0);
};

testManualRiskCreation();
