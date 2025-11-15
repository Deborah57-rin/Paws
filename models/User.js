const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  profile: {
    avatar: String,
    bio: String
  },
  adoptionProgress: {
    selectedDogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dogs' }],
    currentMeeting: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
    pendingApplications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AdoptionApplication' }],
    adoptedDogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dogs' }]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);