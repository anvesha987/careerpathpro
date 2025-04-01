const mongoose = require('mongoose');

// Define the CommunityPost schema
const communityPostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      text: {
        type: String,
        required: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
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
communityPostSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the CommunityPost model
const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

// Export the model
module.exports = CommunityPost;