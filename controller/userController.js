const User = require('../model/userModel');
/* 
*
@desc Register a user
@route POST /api/v1/users/register
@access Public
*
*/

const register = async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;
    const existUser = await User.findOne({ phone });
    if (existUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const user = await User.create({
      name,
      phone,
      role,
    });

    if (user) {
      const hash = await user.genHash(password);
      const accessToken = await user.getSignedJwtToken(user._id);

      const newUser = await User.findOneAndUpdate(
        user._id,
        {
          password: hash,
          accessToken,
        },
        { new: true }
      );

      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

/*
*
@desc Update or Set Password
@route POST /api/v1/users/updatePassword
@access Public
*
*/

const updatePassword = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (password.length < 6 || password.length > 16) {
      return res.status(400).json({
        message: 'Password must be between 6 and 16 characters',
      });
    }

    if (user) {
      const hash = await user.genHash(password);
      const accessToken = await user.getSignedJwtToken(user._id);
      const newUser = await User.findOneAndUpdate(
        { phone },
        { password: hash, accessToken },
        { new: true }
      );

      if (newUser) {
        res.status(200).json(newUser);
      } else {
        res.status(403).json({
          message: 'Password update failed!',
        });
      }
    } else {
      res.status(404).json({
        message: 'User not yet registered!',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

/*
*
@desc Update User Profile
@route POST /api/v1/users/updateProfile
@access Public
*
*/

const updateData = async (req, res) => {
  try {
    const { name, email, address, id } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not yet registered!',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        address,
      },
      { new: true }
    );

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(403).json({
        message: 'User data update failed!',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong! Please try again later.',
    });
  }
};

/*
*
@desc Login a user
@route POST /api/v1/users/login
@access Public
*
*/

const login = async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    if (email === 'example@example.com') {
      return res.status(403).json({
        message: 'You must update your email!',
      });
    }

    if (!phone && !email) {
      return res.status(400).json({
        message: 'Please provide phone or email',
      });
    }

    if (!password) {
      return res.status(400).json({
        message: 'Please provide password',
      });
    }

    const user = await User.findOne({ $or: [{ phone }, { email }] });

    if (!user) {
      return res.status(404).json({
        message: 'User not yet registered!',
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials!',
      });
    }

    const accessToken = await user.getSignedJwtToken(user._id);
    const newUser = await User.findOneAndUpdate(
      { $or: [{ phone }, { email }] },
      { accessToken },
      { new: true }
    );

    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not yet registered!',
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return res.status(404).json({
        message: 'No User Found!',
      });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

module.exports = {
  register,
  updatePassword,
  updateData,
  login,
  getUserById,
  getAllUser,
};
