require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const { Risk } = require('./src/models/Risk');
const { User } = require('./src/models/User');

const seedFromCsv = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    let admin = await User.findOne({ role: 'Admin' });
    if (!admin) {
      admin = await User.findOne();
      if (!admin) {
        console.log('✗ No users found. Register a user first via the app.');
        process.exit(1);
      }
    }
    console.log(`✓ Using user: ${admin.email}`);

    const records = [];
    fs.createReadStream('./data/seed_risks.csv')
      .pipe(csv())
      .on('data', (row) => {
        records.push({
          description: row.description,
          affectedAsset: row.affectedAsset,
          threatType: row.threatType,
          likelihood: Number(row.likelihood),
          impact: Number(row.impact),
          status: row.status || 'Open',
          reportedBy: admin._id,
        });
      })
      .on('end', async () => {
        await Risk.deleteMany({});
        const result = await Risk.insertMany(records);
        console.log(`✓ Seeded ${result.length} risks from CSV`);
        process.exit(0);
      });
  } catch (err) {
    console.error('✗ Seed failed:', err.message);
    process.exit(1);
  }
};

seedFromCsv();
