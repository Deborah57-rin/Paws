require('dotenv').config()
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')

//create express app
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error: ", err);
    process.exit(1);
  });



  

const PORT= process.env.PORT || 3000
app.listen(PORT, () => console.log("✅ Server running on http://localhost:3000"));
