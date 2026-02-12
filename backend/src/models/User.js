const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ROLES = {
  ADMIN: 'Admin',
  ANALYST: 'Security Analyst',
  EMPLOYEE: 'Employee',
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // never return password by default
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.EMPLOYEE,
    },
  },
  { timestamps: true }
);

// Hash password before saving a new/updated user
// In Mongoose 8, async middleware should not receive `next`
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = {
  User: mongoose.model('User', userSchema),
  ROLES,
};

