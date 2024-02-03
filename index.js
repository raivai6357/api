const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();
app.use(express.json());

// TODO: Changed to process.env.NODE_ENV
// Development logging with Morgan
if (process.env.NODEENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'Welcome to the Job Search API',
  });
});

// Mount routers

const userRouter = require('./routes/userRoutes');

const jobberRouter = require('./routes/jobberRoutes');

const postRouter = require('./routes/postRoutes');

const taskRouter = require('./routes/taskRoutes');

app.use('/api/v1/users', userRouter);

app.use('/api/v1/workers', jobberRouter);

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/tasks', taskRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
