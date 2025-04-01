const mongoose = require('mongoose');

// Define the Career schema
const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  requiredSkills: {
    type: [String],
    default: [],
  },
  salaryRange: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  jobMarketDemand: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  growthPotential: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the `updatedAt` field before saving
careerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Career model
const Career = mongoose.model('Career', careerSchema);

// Export the model
module.exports = Career;