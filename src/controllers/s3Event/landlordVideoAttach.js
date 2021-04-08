const Landlord = require("../../domain/landlord");

const main = async ({
  s3: {
    object: { key },
  },
}) => {
  // "landlord/737c655b-147d-4577-81d5-954596bc7b05/answer3/c67f09e0-e3c3-4a43-8c0d-98f83335b55c.mp4"
  const keySplit = key.split("/");
  const userId = keySplit[1];
  const answer = keySplit[2];
  const uri = "https://job-board-dev-bucket.s3-eu-west-1.amazonaws.com";
  // TODO cleanup uploads: get original video and then delete it
  await Landlord.update(
    {
      hashKey: userId,
      rangeKey: "landlord/",
    },
    {
      [answer]: `${uri}/${key}`,
    }
  );
};

exports.handler = async (event) => {
  console.log(event);
  console.log(JSON.stringify(event));
  console.log("end");

  await Promise.all(event.Records.map((record) => main(record)));
};
