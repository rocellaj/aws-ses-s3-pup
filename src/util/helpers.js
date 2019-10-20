const assert = require('assert');


class Helpers {
  constructor() {
    this.log = console.log;
  };

  /**
   * Parse url
   *
   * @param email - marketing email
   * @param emailId = email Id from s3 bucket
   * @returns {string}
   */
  parseUnsubscribeUrl(emailId, email) {
    try {
      const regex = /href="(.*?)"(.*)Unsubscribe/;
      const link = regex.exec(email);
      return link[1];
    } catch (e) {
      this.log(`Assertion failed: unable to find unsubscribe link ${emailId}`);
    }
  }

  /**
   * Write to log for failed and passed assertions
   * @param expected
   * @param actual
   */
  assertion(expected, actual) {
    try {
      assert(expected === actual);
      this.log('Assertion passed');
    } catch (e) {
      this.log('Assertion failed: could not find match expected and actual');
    }
  }
}


module.exports = Helpers;
