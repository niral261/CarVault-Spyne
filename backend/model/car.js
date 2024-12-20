const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] }, 
  images: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Car', carSchema);
