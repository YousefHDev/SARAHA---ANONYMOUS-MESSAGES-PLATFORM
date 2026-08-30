import { AppError } from '../utils/appError.util.js';

export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};
