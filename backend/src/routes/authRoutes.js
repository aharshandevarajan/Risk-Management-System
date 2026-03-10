const express = require('express');
const { register, login } = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { registerRules, loginRules } = require('../validators/authValidators');

const router = express.Router();

// Public auth endpoints with validation
router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);

module.exports = router;

