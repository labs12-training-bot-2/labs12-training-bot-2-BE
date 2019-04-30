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

const { authenticate } = require('./auth/authenticate');

//Routes
const usersRouter = require('./routes/userRouter');
const teamsRouter = require('./routes/teamMemberRouter');
const authRouter = require('./routes/authRouter');
const trainingsRouter = require('./routes/trainingSeriesRouter');
const messageRouter = require('./routes/messageRouter');
const stripeRouter = require('./routes/stripeRouter');
const slackRouter = require('./routes/slackRouter');

//API Endpoints
server.use('/api/auth', authRouter);
server.use('/api/users', authenticate, usersRouter);
server.use('/api/team-members', authenticate, teamsRouter);
server.use('/api/training-series', authenticate, trainingsRouter);
server.use('/api/messages', authenticate, messageRouter);
server.use('/api/stripe', stripeRouter);
server.use('/api/stripe', stripeRouter);
//server.use('/api/slack', slackRouter);

//Default Endpoints
server.get('/', (req, res) => {
	res.send('It works!');
});

// turn on notification interval system
// notificationSystem.clearOldNotifications();
notificationSystem.resetCountOnFirstOfMonth();
notificationSystem.start();

module.exports = server;
