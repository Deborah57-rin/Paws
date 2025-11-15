require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const seedDatabase = require('./seed/seedDogs');

// Create express app
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    await seedDatabase();
  })
  .catch(err => {
    console.error("❌ MongoDB connection error: ", err);
    process.exit(1);
  });

// Import routes
const userRoutes = require('./routes/userRoutes');
const browseRoutes = require('./routes/browseRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');

app.use('/api/user', userRoutes.router); // Note the .router
app.use('/api/browse', browseRoutes);
app.use('/api/meeting', meetingRoutes);
app.use('/api/adoption', adoptionRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));