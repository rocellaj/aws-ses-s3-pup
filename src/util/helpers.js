class Helpers {
  constructor() {};

  /**
   * Parse url
   *
   * @param data
   * @returns {string}
   */
  parseUnsubscribeUrl(data) {
    const regex = /href="(.*?)"(.*)Unsubscribe/;
    const link = regex.exec(data);
    return link[1]
  }
}


module.exports = Helpers;
