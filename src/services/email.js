const simpleParser = require('mailparser').simpleParser;
const S3 = require('./s3');
const Helpers = require('../util/helpers');


class Email {
  constructor() {
    this.log = console.log;
    this.s3 = new S3();
    this.helpers = new Helpers();
  }

  /**
   * Retrieve all emails that are unread and parse unsubscribe urls
   *
   * @returns {Promise<string[]>}
   */
  async getUrls() {
    this.log('Processing email retrieval and parsing...');
    const objects = (await this.s3.listObjects()).Contents.slice(1);

    try {
      return await Promise.all(objects.map(async (contents) => {
        const emailId = contents.Key;
        const body = (await this.s3.getObject(emailId)).Body;
        this.log(`Successfully retrieved ${emailId}`);

        let parsed = await simpleParser(body);
        return this.helpers.parseUnsubscribeUrl(emailId, parsed.html);
      }));
    } catch (e) {
      throw e;
    }
  }

  /**
   * Moves processed emails to read folder and then delete from unread
   *
   * @returns {Promise<void>}
   */

  async cleanup() {
    this.log('Processing email cleanup...');
    const objects = (await this.s3.listObjects()).Contents.slice(1);

    try {
      await Promise.all(objects.map(async (contents) => {
        const emailId = contents.Key;

        await this.s3.copyObject(emailId);
        this.log(`Successfully copied ${emailId}`);
        await this.s3.deleteObject(emailId);
        this.log(`Successfully deleted ${emailId}`);
      }));
    } catch (e) {
      throw e;
    }
  }
}


module.exports = Email;

