//Dependencies
const express = require('express'),
  helmet = require('helmet'),
  cors = require('cors');

//Server to point to
const server = express();

//Library Middleware
server.use(helmet(), express.json(), cors());

// twilio notification system import
const notificationSystem = require('./notificationSystem/startSystem');

//Routes
const usersRouter = require('./routes/userRouter');
const teamsRouter = require('./routes/teamMemberRouter');
const seedRouter = require('./routes/seedRouter');
const authRouter = require('./routes/authRoutes');
const trainingsRouter = require('./routes/trainingSeriesRouter');
const postsRouter = require('./routes/postRouter');
const stripeRouter = require('./routes/stripeRouter');

//API Endpoints
server.use('/api/seed', seedRouter);
server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);
server.use('/api/team-members', teamsRouter);
server.use('/api/training-series', trainingsRouter);
server.use('/api/posts', postsRouter);
server.use('/api/stripe', stripeRouter);

//Default Endpoints
server.get('/', (req, res) => {
  res.send('It works!');
});

// turn on notification interval system
// notificationSystem.clearOldNotifications();
notificationSystem.resetCountOnFirstOfMonth();
notificationSystem.start();

module.exports = server;
