require('dotenv').config();
const mongoose = require('mongoose');
const { Risk } = require('./src/models/Risk');

const deleteAllRisks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const result = await Risk.deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} risks`);
    
    process.exit(0);
  } catch (err) {
    console.error('✗ Failed:', err.message);
    process.exit(1);
  }
};

deleteAllRisks();
