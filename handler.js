const Email = require('./src/services/email');
const Intercom = require('./src/services/intercom');
const unsubscribeFlow = require('./src/util/chrome');
const config = require('./src/util/config');

const email = new Email();
const intercom = new Intercom();

module.exports.unsubscribe = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const urls = await email.getUrls().then(u => u.filter(a => a));
  await unsubscribeFlow(urls);
  await intercom.getUser(config.user.email);
  await email.cleanup();

  callback(null, null);
};
