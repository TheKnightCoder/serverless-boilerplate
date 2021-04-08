const createError = require("http-errors");
const Joi = require("joi");
const Employer = require("../../domain/employer");
const commonMiddy = require("../../domain/middy/commonMiddy");
const {
  validateAuth,
  validateRequest,
  genericResponseMap,
} = require("../../domain/utils");
const { UnauthorizedError, RequestValidationError } = require("../../domain/errors");

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
    const { userId } = validateAuth({ event, group: "employer" });

    const employer = await Employer.update(
      {
        hashKey: userId,
        rangeKey: "employer/",
      },
      {
        companyName,
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(genericResponseMap(employer)),
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw createError(403, error.message);
    }
    if (error instanceof RequestValidationError) {
      throw createError(422, error.message);
    }
    throw error;
  }
};

exports.handler = commonMiddy(handler);
