require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./src/models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@risk.com' });
    if (existingAdmin) {
      console.log('✗ Admin already exists');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@risk.com',
      password: 'admin123',
      role: 'Admin',
    });

    console.log('✓ Admin user created successfully');
    console.log('Email: admin@risk.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('✗ Failed:', err.message);
    process.exit(1);
  }
};

createAdmin();
