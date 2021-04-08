const createError = require("http-errors");
const Joi = require("joi");
const commonMiddy = require("../../domain/middy/commonMiddy");
const Landlord = require("../../domain/landlord");
const {
  validateRequest,
  validateAuth,
  genericResponseMap,
} = require("../../domain/utils");
const { RequestValidationError, UnauthorizedError } = require("../../domain/errors");

const requestSchema = (body) =>
  validateRequest(
    Joi.object({
      companyName: Joi.string().min(2).max(50),
    }),
    body
  );

const handler = async (event) => {
  try {
    console.log(JSON.stringify(event));

    const { companyName } = requestSchema(event.body);
    const { userId, email } = validateAuth({ event, group: "landlord" });

    const landlord = new Landlord({
      hashKey: userId,
      rangeKey: "landlord/",
      email,
      companyName,
    });
    await landlord.save();

    return {
      statusCode: 201,
      body: JSON.stringify(genericResponseMap(landlord)),
    };
  } catch (error) {
    if (error instanceof RequestValidationError) {
      throw createError(422, error.message);
    }
    if (error instanceof UnauthorizedError) {
      throw createError(403, error.message);
    }
    throw error;
  }
};

exports.handler = commonMiddy(handler);

// example of event.requestContext.authorizer.claims
// "sub": "616bb83e-6e3d-474b-b2b9-10c82ab80156",
// "cognito:groups": "landlord",
// "email_verified": "false",
// "iss": "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_FM6ixO33o",
// "custom:accountType": "landlord",
// "cognito:username": "616bb83e-6e3d-474b-b2b9-10c82ab80156",
// "aud": "4p8r9e9b24t2u6u7i08gqcp1u0",
// "event_id": "87b4fd4c-c372-45c7-af6b-75d23f309d1a",
// "token_use": "id",
// "auth_time": "1616935242",
// "exp": "Sun Mar 28 13:40:42 UTC 2021",
// "iat": "Sun Mar 28 12:40:42 UTC 2021",
// "email": "landlord2@test.com"
