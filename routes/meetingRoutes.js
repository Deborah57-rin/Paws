const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const Dog = require('../models/Dogs');
const { authenticateToken } = require('./userRoutes');

// Schedule a meeting
router.post('/schedule', authenticateToken, async (req, res) => {
  try {
    const { dogIds, meetingDetails } = req.body;
    
    // Create meeting
    const meeting = await Meeting.create({
      user: req.user.id,
      dogs: dogIds,
      meetingDetails
    });
    
    // Update user's current meeting
    await User.findByIdAndUpdate(req.user.id, {
      'adoptionProgress.currentMeeting': meeting._id
    });
    
    // Populate and return meeting
    const populatedMeeting = await Meeting.findById(meeting._id).populate('dogs');
    
    res.json({
      success: true,
      meeting: populatedMeeting,
      message: 'Meeting scheduled successfully'
    });
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    res.status(500).json({ success: false, message: 'Error scheduling meeting' });
  }
});

// Get user's meetings
router.get('/my-meetings', authenticateToken, async (req, res) => {
  try {
    const meetings = await Meeting.find({ user: req.user.id })
      .populate('dogs')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, meetings });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ success: false, message: 'Error fetching meetings' });
  }
});

module.exports = router;