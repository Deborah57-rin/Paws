const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Meeting = require('../models/Meeting');
const AdoptionApplication = require('../models/AdoptionApplication');
const Dog = require('../models/Dogs');

const salt = 10;
const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { names, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name: names,
      email: email,
      password: hashedPassword
    });
    
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    
    res.json({ 
      success: true, 
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Error creating user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { mail, pass } = req.body;
    
    if (!mail || !pass) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    
    const user = await User.findOne({ email: mail });

    if (!user) {
      return res.status(400).json({ success: false, message: "Email not found" });
    }

    const validPassword = await bcrypt.compare(pass, user.password);

    if (!validPassword) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('adoptionProgress.selectedDogs')
      .populate('adoptionProgress.currentMeeting')
      .populate('adoptionProgress.pendingApplications')
      .populate('adoptionProgress.adoptedDogs');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        name,
        phone,
        address
      },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
});

// Save selected dogs
router.post('/save-selected-dogs', authenticateToken, async (req, res) => {
  try {
    const { dogIds } = req.body;
    
    // Find dogs by their MongoDB _id (not the numeric id)
    const dogs = await Dog.find({ _id: { $in: dogIds } });
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 'adoptionProgress.selectedDogs': dogIds },
      { new: true }
    ).populate('adoptionProgress.selectedDogs');
    
    res.json({ 
      success: true, 
      selectedDogs: user.adoptionProgress.selectedDogs 
    });
  } catch (error) {
    console.error('Save selected dogs error:', error);
    res.status(500).json({ success: false, message: 'Error saving selected dogs' });
  }
});

// Get user's adoption progress
router.get('/adoption-progress', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('adoptionProgress.selectedDogs')
      .populate({
        path: 'adoptionProgress.currentMeeting',
        populate: { path: 'dogs' }
      })
      .populate({
        path: 'adoptionProgress.pendingApplications',
        populate: { path: 'dog' }
      })
      .populate('adoptionProgress.adoptedDogs');
    
    // Get recent meetings
    const meetings = await Meeting.find({ user: req.user.id })
      .populate('dogs')
      .sort({ createdAt: -1 });
    
    // Get adoption applications
    const applications = await AdoptionApplication.find({ user: req.user.id })
      .populate('dog')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      progress: user.adoptionProgress,
      meetings,
      applications
    });
  } catch (error) {
    console.error('Adoption progress error:', error);
    res.status(500).json({ success: false, message: 'Error fetching progress' });
  }
});

module.exports = { router, authenticateToken };