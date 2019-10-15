const Helpers = require('./src/util/helpers');
const getEmail = require('./src/services/s3');
const unsubscribeFlow = require('./src/util/chrome');
const helpers = new Helpers();

module.exports.unsubscribe = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const emailBody = await getEmail();
  emailBody.forEach(async (entry) => {
    const url = await helpers.parseUnsubscribeUrl(entry);
    console.log(url);
  });

  const url = '';
  await unsubscribeFlow(url);

  callback(null, null)
};



