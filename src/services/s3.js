const AWS = require('aws-sdk');
const simpleParser = require('mailparser').simpleParser;
const log = console.log;

AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-east-1'});
const s3 = new AWS.S3();

const params = {
  Bucket: 'casl-marketing',
};


/**
 * List objects by prefix
 *
 * @param params
 * @returns {Promise<never>}
 */
async function listObjects(params) {
  params = {
    ...params,
    Delimiter: '',
    Prefix: 'unread/'
  };

  return s3.listObjectsV2(params).promise();
}

/**
 * Get objects by key
 * @param params
 * @param key
 * @returns {Promise<never>}
 */
async function getObjects(params, key) {
  params = {...params,
    Key: key
  };

  return s3.getObject(params).promise();
}

/**
 * Copy objects from one folder to another
 *
 * @param params
 * @param key
 * @returns {Promise<never>}
 */
async function copyObject(params, key) {
  params = {...params,
    CopySource: `casl-marketing/${key}`,
    Key: key.replace('unread', 'read')
  };

  return s3.copyObject(params).promise();
}

/**
 * Retrieve all emails that are unread
 * @returns {Promise<any[]>}
 */
async function getEmail() {
  log('Retrieving list of objects');
  let objects = (await listObjects(params)).Contents.slice(1);

  log('Retrieving object content');
  return await Promise.all(objects.map(async(contents) => {
    const body = (await getObjects(params, contents.Key)).Body;
    let parsed = await simpleParser(body);
    log('Successfully retrieved content');
    return parsed.html;
  }));
}

module.exports = getEmail;
