const express = require('express');
const router = express.Router();

const {
  register,
  updatePassword,
  updateData,
  login,
  getUserById,
  getAllUser,
} = require('../controller/userController');

/* Register User Route */
router.route('/register').post(register);
/* Update or Set Password */
router.route('/updatePassword').post(updatePassword);
/* Update User Profile */
router.route('/updateProfile').put(updateData);
/* User Login */
router.route('/login').post(login);
router.route('/getbyid').post(getUserById);
router.route('/getall').get(getAllUser);

module.exports = router;
