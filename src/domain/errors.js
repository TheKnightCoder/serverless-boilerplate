/* eslint-disable max-classes-per-file */
class RequestValidationError extends Error {}
class UnauthorizedError extends Error {}
class NotFoundError extends Error {}

module.exports = {
  RequestValidationError,
  UnauthorizedError,
  NotFoundError
};
