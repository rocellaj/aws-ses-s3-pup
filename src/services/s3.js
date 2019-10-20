const AWS = require('aws-sdk');
const config = require('../util/config');


class S3 {
  constructor() {
    AWS.config.update(config.aws);
    this.s3 = new AWS.S3();
  }

  /**
   * List objects by prefix
   *
   * @returns {Promise<*>}
   */
  async listObjects() {
    const params = {
      Bucket: 'casl-marketing',
      Delimiter: '',
      Prefix: 'unread/',
    };

    return this.s3.listObjects(params).promise();
  }

  /**
   * Get objects by key
   *
   * @param key
   * @returns {Promise<*>}
   */
  async getObject(key) {
    const params = {
      Bucket: 'casl-marketing',
      Key: key,
    };

    return this.s3.getObject(params).promise();
  }

  /**
   * Copy objects from one folder to another
   *
   * @param key
   * @returns {Promise<*>}
   */
  async copyObject(key) {
    const params = {
      Bucket: 'casl-marketing',
      CopySource: `casl-marketing/${key}`,
      Key: key.replace('unread', 'read'),
    };

    return this.s3.copyObject(params).promise();
  }

  /**
   * Delete objects
   *
   * @param key
   * @returns {Promise<*>}
   */
  async deleteObject(key) {
    const params = {
      Bucket: 'casl-marketing',
      Key: key,
    };

    return this.s3.deleteObject(params).promise();
  }
}


module.exports = S3;
