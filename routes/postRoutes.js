const express = require('express');
const router = express.Router();

const {
  createPost,
  getPosts,
  getPost,
  getPostsByUser,
  editPost,
  getPostsByKeyword,
} = require('../controller/postController');

/* Create Post Route */

router.route('/create').post(createPost);
router.route('/get-all').get(getPosts);
router.route('/get-by-id/:id').get(getPost);
router.route('/get-by-user/:id').get(getPostsByUser);
router.route('/edit').put(editPost);
router.route('/get-by-keyword').post(getPostsByKeyword);

module.exports = router;
