const express = require('express');
const router = express.Router();

const {
  register,
  login,
  updateProfile,
  updatePassword,
  getAllJobbers,
  getJobberById,
} = require('../controller/jobberController');

/* Register User Route */
router.route('/register').post(register);
/* Update or Set Password */
router.route('/updatePassword').post(updatePassword);
/* Update User Profile */
router.route('/updateProfile').put(updateProfile);
/* User Login */
router.route('/login').post(login);
router.route('/getbyid').post(getJobberById);
router.route('/getall').get(getAllJobbers);

module.exports = router;
