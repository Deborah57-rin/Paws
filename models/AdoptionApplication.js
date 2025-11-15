const mongoose = require('mongoose');

const adoptionApplicationSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    dog: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Dogs', 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected', 'completed'], 
      default: 'pending' 
    },
    personalInfo: {
      fullName: { type: String, required: true },
      dob: { type: Date, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true }
    },
    homeEnvironment: {
      housing: { type: String, required: true },
      ownRent: { type: String, required: true },
      yard: { type: String, required: true },
      fenced: { type: String }
    },
    familyPets: {
      adults: { type: Number, required: true },
      children: { type: Number, required: true },
      otherPets: { type: String, required: true },
      petsFixed: { type: String }
    },
    previousExperience: {
      previousDog: { type: String, required: true },
      previousDogFate: { type: String }
    },
    agreements: {
      agreeCare: { type: Boolean, required: true },
      agreeReturn: { type: Boolean, required: true },
      agreeHomecheck: { type: Boolean, required: true },
      agreeTerms: { type: Boolean, required: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdoptionApplication', adoptionApplicationSchema);