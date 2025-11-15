const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: String, required: true },
    size: { type: String, required: true },
    location: { type: String, required: true },
    gender: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    adopted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dogs", dogSchema);
