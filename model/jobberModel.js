const mongoose = require('mongoose');

const jobberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'user',
    },
    email: {
      type: String,
      lowercase: true,
      default: 'example@example.com',
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRlzB_9muIg5yjDIsYV6JGerdf4f8PxfLJvQMrN64&s',
    },
    address: {
      type: String,
      default: 'N/A',
    },
    password: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    location: {
      lat: {
        type: Number,
        default: 0,
      },
      lng: {
        type: Number,
        default: 0,
      },
    },
    role: {
      type: String,
      enum: [
        'electrician',
        'plumber',
        'carpenter',
        'painter',
        'mechanic',
        'labourer',
      ],
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model('Jobber', jobberSchema);
