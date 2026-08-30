export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Mongoose / DB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    err.statusCode = 400;
    err.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    err.message = 'Invalid token. Please log in again.';
  }
  if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.message = 'Your session has expired. Please log in again.';
  }

  // Log error in non-production or for unexpected errors
  if (process.env.NODE_ENV !== 'production' && err.statusCode === 500) {
    console.error('SERVER ERROR 🔥:', err);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'Something went wrong on the server',
    errors: err.errors || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
