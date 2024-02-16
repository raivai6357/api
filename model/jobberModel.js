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

jobberSchema.methods.getSignedJwtToken = function (id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

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

// Update password using bcrypt

jobberSchema.methods.genHash = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// Sign JWT and return

jobberSchema.methods.getSignedJwtToken = function (id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Check access token is expired or not

jobberSchema.methods.isTokenExpired = function (token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    return true;
  } else {
    return false;
  }
};

// Match user entered password to hashed password in database

jobberSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Geocode and create location field

jobberSchema.methods.genLocation = function (lat, lng) {
  return {
    type: 'Point',
    // geoJSON expects lng first then lat
    coordinates: [lng, lat],
  };
};

module.exports = mongoose.model('Jobber', jobberSchema);
