const config = {
  aws: {
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
  },
  puppeteer: {
    width: 1366,
    height: 768,
    pageWaitTime: 1000,
    waitUntil: 'networkidle0',
  },
  intercom: {
    token: '',
    baseUrl: 'https://api.intercom.io',
  },
  user: {
    email: '',
  },
};

module.exports = config;
