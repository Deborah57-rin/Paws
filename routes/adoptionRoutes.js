const express = require('express');
const router = express.Router();
const AdoptionApplication = require('../models/AdoptionApplication');
const Dog = require('../models/Dogs');
const User = require('../models/User');
const { authenticateToken } = require('./userRoutes');

// Submit adoption application
router.post('/apply', authenticateToken, async (req, res) => {
  try {
    const { dogId, applicationData } = req.body;
    
    // Find dog by MongoDB _id
    const dog = await Dog.findById(dogId);
    if (!dog) {
      return res.status(404).json({ success: false, message: 'Dog not found' });
    }
    
    if (dog.adopted) {
      return res.status(400).json({ success: false, message: 'Dog is already adopted' });
    }
    
    // Create adoption application
    const application = await AdoptionApplication.create({
      user: req.user.id,
      dog: dog._id,
      ...applicationData
    });
    
    // Add to user's pending applications
    await User.findByIdAndUpdate(req.user.id, {
      $push: { 'adoptionProgress.pendingApplications': application._id }
    });
    
    const populatedApplication = await AdoptionApplication.findById(application._id)
      .populate('dog')
      .populate('user', 'name email');
    
    res.json({
      success: true,
      application: populatedApplication,
      message: 'Adoption application submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ success: false, message: 'Error submitting application' });
  }
});

// Get user's adoption applications
router.get('/my-applications', authenticateToken, async (req, res) => {
  try {
    const applications = await AdoptionApplication.find({ user: req.user.id })
      .populate('dog')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Error fetching applications' });
  }
});

module.exports = router;