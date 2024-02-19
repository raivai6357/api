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

// Encrypt password using bcrypt

jobberSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  // Generate salt
  const salt = await bcrypt.genSalt(10);
  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

jobberSchema.methods.getSignedJwtToken = function (id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database

jobberSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update password using bcrypt

jobberSchema.methods.genHash = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

module.exports = mongoose.model('Jobber', jobberSchema);
