const Helper = require('../util/helpers');
const client = require('../util/client');
const config = require('../util/config');
const assertion = require('../util/assertion');


class Intercom {
  constructor() {
    this.log = console.log;
    this.helper = new Helper();

    this.token = config.intercom.token;
    this.baseUrl = config.intercom.baseUrl;
  }

  /**
   * Get user from intercom by email
   *
   * @param email
   * @returns {Promise<void>}
   */
  async getUser(email) {
    const user = await client(this.baseUrl, this.token).get({
      url: `/users`,
      qs: {
        email,
      },
    });

    this.log('Successfully retrieved intercom user information');
    const unsubscribedFromEmailsStatus = user.body.users[0].unsubscribed_from_emails;
    this.helper.assertion(assertion.intercom.unsubscribeStatus, unsubscribedFromEmailsStatus);
  };
}


module.exports = Intercom;
