const createError = require("http-errors");
const Employer = require("../../domain/employer");
const commonMiddy = require("../../domain/middy/commonMiddy");
const { validateAuth, genericResponseMap } = require("../../domain/utils");
const { UnauthorizedError, NotFoundError } = require("../../domain/errors");

const handler = async (event) => {
  try {
    console.log(JSON.stringify(event));

    const { userId } = validateAuth({ event, group: "employer" });

    const employer = await Employer.get({
      hashKey: userId,
      rangeKey: "employer/",
    });
    if(!employer) {
      throw new NotFoundError('Employer not found')
    }
    return {
      statusCode: 200,
      body: JSON.stringify(genericResponseMap(employer)),
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw createError(403, error.message);
    }
    if (error instanceof NotFoundError) {
      throw createError(404, error.message);
    }
    throw error;
  }
};

exports.handler = commonMiddy(handler);
