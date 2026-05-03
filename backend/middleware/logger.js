const morgan = require('morgan');
const fs     = require('fs');
const path   = require('path');

morgan.token('body', (req) => {
  const sensitive = ['password', 'token', 'secret'];
  const body = { ...req.body };
  sensitive.forEach(key => { if (body[key]) body[key] = '***'; });
  return JSON.stringify(body);
});

const getFileLogger = () => {
  const logPath = path.join(__dirname, '..', 'access.log');
  const stream  = fs.createWriteStream(logPath, { flags: 'a' });
  return morgan('combined', { stream });
};

const getDevLogger = () => morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
);

module.exports = process.env.NODE_ENV === 'production' ? getFileLogger() : getDevLogger();