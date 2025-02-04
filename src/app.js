// imports here
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const clerkMiddleware = require('@clerk/express');

const clerkConfig = require('./config/clerk_config');
const requestTimeMiddleware = require('./middlewares/request_time_middleware');
const webhookController = require('./controllers/webhookController');

// assignment and expressions here
const app = express();

// middlewares here
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
// set http security headers
app.use(helmet());
// data sanitization against NoSQL query injection
app.use(mongoSanitize());
// data sanitization against cross site scripting
app.use(xss());
// prevent parameter pollution and remove duplicate fields
app.use(hpp());
// Custom middleware : adds the request time to the request object
app.use(requestTimeMiddleware);
// clerk Authentication
app.use(clerkMiddleware(clerkConfig));

// route controllers
app.get('/api/webhooks/clerk', webhookController.clerk);

module.exports = app;
