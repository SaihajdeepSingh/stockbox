// middleware/logger.js — Request logging middleware (Syllabus: Lecture 25-28)
const morgan = require('morgan');
const fs     = require('fs');
const path   = require('path');

// Custom token for response body (truncated)
morgan.token('body', (req) => {
  const sensitive = ['password', 'token', 'secret'];
  const body = { ...req.body };
  sensitive.forEach(key => { if (body[key]) body[key] = '***'; });
  return JSON.stringify(body);
});

// Write combined log to file in production
const getFileLogger = () => {
  const logPath = path.join(__dirname, '..', 'access.log');
  const stream  = fs.createWriteStream(logPath, { flags: 'a' });
  return morgan('combined', { stream });
};

// Colourful dev logger to console
const getDevLogger = () => morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
);

module.exports = process.env.NODE_ENV === 'production' ? getFileLogger() : getDevLogger();
