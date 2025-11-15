const express = require('express');
const router = express.Router();
const Dog = require('../models/Dogs');

// GET all dogs
router.get('/all', async (req, res) => {
  try {
    const dogs = await Dog.find({});
    res.json({
      success: true,
      dogs: dogs
    });
  } catch (error) {
    console.error('Error fetching dogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dogs from database'
    });
  }
});

// GET dogs with filters
router.get('/filter', async (req, res) => {
  try {
    const { size, age, location, gender } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (size && size !== 'all') {
      filter.size = size;
    }
    
    if (location && location !== 'all') {
      filter.location = location;
    }
    
    if (gender && gender !== 'all') {
      filter.gender = gender;
    }
    
    // Age filter requires special handling
    let dogs = await Dog.find(filter);
    
    if (age && age !== 'all') {
      dogs = dogs.filter(dog => {
        const ageStr = dog.age.toLowerCase();
        const ageNum = parseInt(ageStr);
        
        switch (age) {
          case 'puppy':
            return ageStr.includes('puppy') || ageStr.includes('month') || (ageNum <= 1);
          case 'young':
            return (ageNum >= 1 && ageNum <= 3) || ageStr.includes('year');
          case 'adult':
            return (ageNum >= 3 && ageNum <= 8);
          case 'senior':
            return ageNum > 8;
          default:
            return true;
        }
      });
    }
    
    res.json({
      success: true,
      dogs: dogs
    });
    
  } catch (error) {
    console.error('Error filtering dogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error filtering dogs'
    });
  }
});

// GET dog by MongoDB _id
router.get('/:id', async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    
    if (!dog) {
      return res.status(404).json({
        success: false,
        message: 'Dog not found'
      });
    }
    
    res.json({
      success: true,
      dog: dog
    });
    
  } catch (error) {
    console.error('Error fetching dog:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dog'
    });
  }
});

module.exports = router;