const AWS = require("aws-sdk");

exports.handler = async (event) => {
  console.log(event);
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

  const { "custom:accountType": accountType = "" } =
    event?.request?.userAttributes || {};
  const normalizedAccountType = accountType.toLowerCase();

  if (
    normalizedAccountType !== "landlord"
  ) {
    throw new Error(`Invalid accountType ${accountType}.`);
  }

  await cognitoidentityserviceprovider
    .adminAddUserToGroup({
      GroupName: normalizedAccountType,
      UserPoolId: event.userPoolId,
      Username: event.userName,
    })
    .promise();
  return event;
};
