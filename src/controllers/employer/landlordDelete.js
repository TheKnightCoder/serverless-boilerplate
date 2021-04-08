const createError = require("http-errors");
const Landlord = require("../../domain/landlord");
const commonMiddy = require("../../domain/middy/commonMiddy");
const { validateAuth } = require("../../domain/utils");
const { UnauthorizedError } = require("../../domain/errors");

const handler = async (event) => {
  try {
    console.log(JSON.stringify(event));

    const { userId } = validateAuth({ event, group: "landlord" });

    await Landlord.delete({
      hashKey: userId,
      rangeKey: "landlord/",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: "landlord deleted",
      }),
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw createError(403, error.message);
    }
    throw error;
  }
};

exports.handler = commonMiddy(handler);
