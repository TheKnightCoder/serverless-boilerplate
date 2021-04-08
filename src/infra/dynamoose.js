const dynamoose = require("dynamoose");

const { sdk } = dynamoose.aws;

sdk.config.update({
  region: "eu-west-1",
});

class Model {
  constructor(schema) {
    return dynamoose.model(process.env.mainTable, schema);
  }
}

module.exports = Model;
