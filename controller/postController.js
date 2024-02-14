const Post = require('../model/postModel');

const createPost = async (req, res) => {
  try {
    const { title, description, user } = req.body;

    if (!title || !description || !user) {
      return res.status(400).json({
        message: 'Please fill all required fields',
      });
    }

    // filter active only post and user
    const activePost = await Post.find({ active: true, user });

    if (activePost.length >= 3) {
      return res.status(400).json({
        message: 'You can only create 3 active posts',
      });
    }

    const post = await Post.create({
      title,
      description,
      user,
    });

    if (post) {
      /// res.status(201).json(post);

      // Populate user field then return the post

      const populatedPost = await Post.findById(post._id).populate('user');

      res.status(201).json(populatedPost);
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ active: true }).populate('user');

    if (posts) {
      res.status(200).json(posts);
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user');

    if (post) {
      res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id }).populate('user');

    if (posts) {
      res.status(200).json(posts);
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const editPost = async (req, res) => {
  try {
    const { title, description, id } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: 'Please fill all required fields',
      });
    }

    const post = await Post.findByIdAndUpdate(id, {
      title,
      description,
    });

    if (post) {
      res.status(200).json({
        message: 'Post updated successfully',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getPostsByKeyword = async (req, res) => {
  try {
    const { keyword } = req.body;
    if (keyword === 'all' || keyword === 'All') {
      const posts = await Post.find({ active: true }).populate('user');

      if (posts) {
        return res.status(200).json(posts);
      }
    }
    const posts = await Post.find({
      title: { $regex: keyword, $options: 'i' },
    }).populate('user');

    if (posts) {
      return res.status(200).json(posts);
    } else {
      return res.status(404).json({
        message: 'No post found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getPostsByUser,
  editPost,
  getPostsByKeyword,
};
