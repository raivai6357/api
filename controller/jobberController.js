const Jobber = require('../model/jobberModel');
const bcrypt = require('bcryptjs');

// @desc    Register a new jobber
// @route   POST /api/jobber/register
// @access  Public

const register = async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    const jobber = await Jobber.findOne({ phone });

    if (jobber) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this phone number',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newJobber = await Jobber.create({
      name,
      phone,
      password: hashedPassword,
      role,
    });

    return res.status(201).json(newJobber);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to register jobber',
    });
  }
};

// @desc    Login a jobber
// @route   POST /api/jobber/login
// @access  Public

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide password',
      });
    }

    const jobber = await Jobber.findOne({ phone });

    if (!jobber) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // console.log(jobber);
    const isMatch = await bcrypt.compare(password, jobber.password);

    // console.log(jobber);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    res.status(200).json(jobber);
  } catch (error) {
    res.status(500).json({
      message: 'Unable to login jobber',
    });
  }
};

// @desc    Update jobber profile
// @route   PUT /api/jobber/updateProfile
// @access  Private

const updateProfile = async (req, res) => {
  try {
    const { name, email, address, profileImage, id } = req.body;

    const jobber = await Jobber.findById(id);

    if (!jobber) {
      return res.status(404).json({
        success: false,
        message: 'User not yet registered!',
      });
    }

    const updatedJobber = await Jobber.findByIdAndUpdate(
      id,
      {
        name: name,
        email: email,
        address: address,
        profileImage: profileImage,
      },
      { new: true }
    );

    return res.status(200).json(updatedJobber);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to update jobber profile!',
    });
  }
};

// @desc    Update jobber password
// @route   PUT /api/jobber/updatePassword
// @access  Private

const updatePassword = async (req, res) => {
  try {
    const { oldPass, newPass, id } = req.body;

    // Check if user exists
    const jobber = await Jobber.findById(id);

    if (!jobber) {
      return res.status(404).json({
        message: 'User not found in the DB!',
      });
    }

    // Check if old password is correct
    const isMatch = await bcrypt.compare(oldPass, jobber.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Old password is incorrect!',
      });
    }

    // Update the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPass, salt);

    const updatedJobber = await Jobber.findByIdAndUpdate(
      id,
      { password: hash },
      { new: true }
    );

    if (updatedJobber) {
      return res.status(200).json(updatedJobber);
    } else {
      return res.status(403).json({
        message: 'Password update failed!',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const updateLocation = async (req, res) => {
  const { uid, location } = req.body;

  const existedUser = await Jobber.findById(uid);

  if (existedUser) {
    const updatedUser = await Jobber.findByIdAndUpdate(
      uid,
      { location: location },
      { new: true }
    );

    if (updatedUser) {
      return res.status(200).json(updatedUser);
    }
  } else {
    return res.status(404).json({
      message: 'User not found in the database',
    });
  }
};

// @desc    Get all jobbers
// @route   GET /api/jobber/getall
// @access  Private

const getAllJobbers = async (req, res) => {
  try {
    const jobbers = await Jobber.find({});

    if (jobbers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No jobbers found!',
      });
    }

    return res.status(200).json(jobbers);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to get jobbers',
    });
  }
};

// @desc    Get jobber by id
// @route   POST /api/jobber/getbyid
// @access  Private

const getJobberById = async (req, res) => {
  try {
    const { id } = req.body;

    const jobber = await Jobber.findById(id);

    if (!jobber) {
      return res.status(404).json({
        message: 'Jobber not found!',
      });
    }

    return res.status(200).json(jobber);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to get jobber by id',
    });
  }
};

module.exports = {
  register,
  login,
  updateProfile,
  updatePassword,
  getAllJobbers,
  getJobberById,
  updateLocation,
};
