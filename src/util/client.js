const requests = require('request-promise');

/**
 * Set request defaults
 *
 * @param baseUrl
 * @param token
 * @returns {*}
 */
const client = (baseUrl, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  return requests.defaults({
    baseUrl,
    json: true,
    resolveWithFullResponse: true,
    headers,
  });
};

module.exports = client;
