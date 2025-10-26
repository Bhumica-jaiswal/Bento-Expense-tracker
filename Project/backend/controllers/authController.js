const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  const { email, password } = req.body;

  console.log('=== SIGNUP DEBUG ===');
  console.log('Email:', email);
  console.log('Password length:', password ? password.length : 'undefined');

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Creating new user...');
    const user = await User.create({
      email,
      password,
    });

    console.log('User created successfully:', user._id);

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  console.log('=== LOGIN DEBUG ===');
  console.log('Email:', email);
  console.log('Password provided:', !!password);
  console.log('Request body:', req.body);

  try {
    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email });
    console.log('User found:', !!user);
    
    if (user) {
      console.log('User details:', {
        _id: user._id,
        email: user.email,
        isSetupComplete: user.isSetupComplete,
        defaultCurrency: user.defaultCurrency
      });
      
      console.log('Comparing password...');
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', passwordMatch);
      
      if (passwordMatch) {
        console.log('Generating token...');
        const token = generateToken(user._id);
        console.log('Token generated successfully');
        
        res.json({
          _id: user._id,
          email: user.email,
          token: token,
          isSetupComplete: user.isSetupComplete,
          defaultCurrency: user.defaultCurrency,
        });
      } else {
        console.log('Password does not match');
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      console.log('User not found');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  // The user is already available in req.user
  res.status(200).json(req.user);
};

// @desc    Complete user setup
// @route   PUT /api/auth/setup
// @access  Private
const completeSetup = async (req, res) => {
  const { defaultCurrency } = req.body;

  if (!defaultCurrency) {
    return res.status(400).json({ message: 'Default currency is required' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        defaultCurrency,
        isSetupComplete: true 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      defaultCurrency: user.defaultCurrency,
      isSetupComplete: user.isSetupComplete,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  completeSetup,
};