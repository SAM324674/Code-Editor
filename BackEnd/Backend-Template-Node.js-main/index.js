// Importing necessary modules
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const colors = require('colors');
const { rateLimit } = require('express-rate-limit');
const NodeCache = require('node-cache');
const MongoDBAtlas = require('./configs/Databases/MongoDBAtlas');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const helmet = require('helmet');
const fs = require('fs');

// Load environment variables from .env file
dotenv.config();

// Initialize the express application
const app = express();
const myCache = new NodeCache();

// Rate Limiter Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window (15 minutes)
  standardHeaders: 'draft-7', // Use combined RateLimit header
  legacyHeaders: false, // Disable X-RateLimit-* headers
  // store: ... , // Redis, Memcached, etc. (optional)
});

// Secure Express apps by setting HTTP response headers
app.use(helmet());

// Middlewaare for Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for logging HTTP requests to the console if the status code is 400 or above
app.use(
  morgan('dev', {
    skip: (req, res) => res.statusCode < 400,
  }),
);

// Create a rotating write stream for access logs
const accessLogStream = rfs.createStream('access.log', {
  interval: '7d', // Rotate weekly
  path: path.join(__dirname, 'logs'),
});

// Setup the logger to write logs to a file
app.use(morgan('dev', { stream: accessLogStream }));

// Apply the rate limiter to all requests
app.use(limiter);

// Use routes defined in the routes module
app.use('/', routes);

// Error handling middleware
app.use(errorHandler);

// Get the port from environment variables and start the server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
