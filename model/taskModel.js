const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Jobber',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'running', 'completed'],
      default: 'pending',
    },
    active: {
      type: Boolean,
      default: true,
    },
    ratings: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          rating: {
            type: Number,
            min: 1,
            max: 5,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
