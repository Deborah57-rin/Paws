const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    dogs: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Dogs' 
    }],
    status: { 
      type: String, 
      enum: ['scheduled', 'completed', 'cancelled'], 
      default: 'scheduled' 
    },
    meetingDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      date: { type: Date, required: true },
      time: { type: String, required: true },
      location: { type: String, required: true },
      notes: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meeting', meetingSchema);