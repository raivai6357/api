const Task = require('../model/taskModel');
const Post = require('../model/postModel');
const User = require('../model/userModel');

const createTask = async (req, res) => {
  try {
    const { post, applicant } = req.body;

    if (!post || !applicant) {
      return res.status(400).json({
        message: 'Please fill all required fields',
      });
    }

    // check if post exists
    const existPost = await Post.findById(post);

    if (!existPost) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    // check if post is active

    if (!existPost.active) {
      return res.status(404).json({
        message: 'Post is not available now!',
      });
    }

    // already applied with current applicant

    const existTask = await Task.findOne({ post, applicant });

    if (existTask) {
      return res.status(400).json({
        message: 'You already applied for this post!',
      });
    }

    const task = await Task.create({
      post,
      applicant,
    });

    if (task) {
      res.status(201).json(task);
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getClientTasks = async (req, res) => {
  try {
    const { user } = req.body;
    const tasks = await Task.find({}).populate('post').populate('applicant');

    const filteredTasks = tasks.filter((task) => {
      return task.post.user.toString() === user;
    });

    const currentUser = await User.findById(user);

    // inside the filteredTasks array, post.username = currentUser.name

    const modifiedTask = filteredTasks.map((task) => {
      var newTask = task.toObject();
      newTask.post.clientName = currentUser.name;
      return newTask;
    });

    // filter the tasks based on task status
    const filtered2Tasks = modifiedTask.filter((task) => {
      return (
        task.status === 'pending' ||
        task.status === 'accepted' ||
        task.status === 'running'
      );
    });

    res.status(200).json(filtered2Tasks);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getClientCompletedTasks = async (req, res) => {
  try {
    const { user } = req.body;
    const tasks = await Task.find({}).populate('post').populate('applicant');

    const filteredTasks = tasks.filter((task) => {
      return task.post.user.toString() === user;
    });

    const currentUser = await User.findById(user);

    // inside the filteredTasks array, post.username = currentUser.name

    const modifiedTask = filteredTasks.map((task) => {
      var newTask = task.toObject();
      newTask.post.clientName = currentUser.name;
      return newTask;
    });

    // filter the tasks based on task status
    const filtered2Tasks = modifiedTask.filter((task) => {
      return task.status === 'completed' || task.status === 'rejected';
    });

    res.status(200).json(filtered2Tasks);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getAppliedTasks = async (req, res) => {
  try {
    const { user } = req.body;
    const tasks = await Task.find({ applicant: user })
      .populate('post')
      .populate('applicant');

    const filteredTasks = tasks.filter((task) => {
      return (
        task.status === 'pending' ||
        task.status === 'accepted' ||
        task.status === 'running'
      );
    });

    res.status(200).json(filteredTasks);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const getCompletedTasks = async (req, res) => {
  try {
    const { user } = req.body;
    const tasks = await Task.find({ applicant: user })
      .populate('post')
      .populate('applicant');

    const filteredTasks = tasks.filter((task) => {
      return task.status === 'completed' || task.status === 'rejected';
    });

    res.status(200).json(filteredTasks);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

const updateTask = async (req, res) => {
  const { id, status } = req.body;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    // status == completed then the post status should be updated to false
    if (status === 'completed') {
      const updatedPost = await Post.findByIdAndUpdate(
        task.post,
        {
          active: false,
        },
        {
          new: true,
        }
      );
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

module.exports = {
  createTask,
  getClientTasks,
  getClientCompletedTasks,
  updateTask,
  getAppliedTasks,
  getCompletedTasks,
};
