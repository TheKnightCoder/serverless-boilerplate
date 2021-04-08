const Model = require("../../infra/dynamoose");

const Landlord = new Model(
  {
    hashKey: {
      hashKey: true,
      type: String,
    },
    rangeKey: {
      rangeKey: true,
      type: String,
    },
    entityType: {
      type: String,
      default: "landlord",
    },
    email: {
      type: String,
    },
    companyName: {
      type: String,
    },
    // name: {
    //   type: String,
    //   index: {
    //     rangeKey: "somefield",
    //     name: "GSI-name",
    //     global: true,
    //   },
    // },
  },
  {
    saveUnknown: true,
    timestamps: true,
  }
);

module.exports = Landlord;
