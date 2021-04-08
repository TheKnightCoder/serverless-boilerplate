const { RequestValidationError, UnauthorizedError } = require("./errors");

const validateRequest = (schema, body = {}) => {
  const { error, value } = schema.validate(body || {}, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });

  if (error) {
    throw new RequestValidationError(
      `Validation error: ${error.details.map((x) => x.message).join(", ")}`
    );
  }

  return value;
};

const validateAuth = ({ event, group: selectedGroup }) => {
  const authorizer = event.requestContext?.authorizer?.claims || {};
  const { sub: userId, email, "cognito:groups": group } = authorizer;

  if (group !== selectedGroup) {
    throw new UnauthorizedError(`User must be an ${selectedGroup}`);
  }
  if (!userId) {
    throw new UnauthorizedError("User Id does not exist.");
  }
  return {
    userId,
    email,
    group,
  };
};
const getGroup = (event) => {
  const authorizer = event.requestContext?.authorizer?.claims || {};
  const { "cognito:groups": group } = authorizer;
  return group;
};
const genericResponseMap = (response) => {
  const { hashKey, rangeKey, ...rest } = response;
  return {
    id: hashKey,
    ...rest,
  };
};
module.exports = {
  validateRequest,
  validateAuth,
  getGroup,
  genericResponseMap,
};
