require('dotenv').config();
const mongoose = require('mongoose');
const { Risk } = require('./src/models/Risk');

const clearAICache = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await Risk.updateMany(
      {},
      { $unset: { aiInsight: "" } }
    );

    console.log(`✓ Cleared AI cache from ${result.modifiedCount} risks`);
    console.log('Next time you click "View AI Analysis", fresh insights will be generated');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

clearAICache();
