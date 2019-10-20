const launchChrome = require('@serverless-chrome/lambda');
const request = require('request-promise');
const puppeteer = require('puppeteer');
const Helper = require('./helpers');
const assertions = require('./assertion');
const unsubscribeSelectors = require('./selectors');
const config = require('./config');
const log = console.log;

/**
 * Launch chrome with local host endpoint
 *
 * @returns {Promise<{endpoint: *, instance}>}
 */

const getChrome = async () => {
  let chrome = await launchChrome();

  const options = {
    method: 'GET',
    url: `${chrome.url}/json/version`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await request.get(options).then(res => JSON.parse(res));
  const endpoint = response.webSocketDebuggerUrl;

  log('Retrieving chrome browser');
  return {
    endpoint,
    instance: chrome,
  };
};

/***
 * Click  based on the evaluated selector
 *
 * @param selector - element selector
 * @param page - browser new page
 * @returns {Promise<*>}
 */
async function click(page, selector) {
  return await page.evaluate((elementSelector) =>
    document.querySelector(elementSelector).click(), selector);
}

/**
 * Initiate unsubscribe flow to unsubscribe users from marketing emails
 *
 * @returns {Promise<void>}
 */

async function unsubscribeFlow(urls) {
  const helper = new Helper();
  let actual;

  const chrome = await getChrome();
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint,
  });


  for (const url of urls) {
    log('Starting unsubscribe flow...');
    const page = await browser.newPage();
    await page.setViewport({width: config.puppeteer.width, height: config.puppeteer.height});

    await page.goto(url, {waitUntil: config.puppeteer.waitUntil});
    await page.goto(url);
    await page.waitFor(config.puppeteer.pageWaitTime);
    log(`Successfully loaded the homepage ${url}`);
    actual = await page.evaluate((selector) =>
      document.querySelector(selector).innerHTML, unsubscribeSelectors.header);
    helper.assertion(assertions.unsubscribe.header, actual);
    await page.type(unsubscribeSelectors.emailField, config.user.email);
    await page.waitFor(config.puppeteer.pageWaitTime);
    await click(page, unsubscribeSelectors.submitButton);
    await page.waitFor(config.puppeteer.pageWaitTime);
    //TODO: Assertion for the confirmation pop up
    log('Successfully submitted unsubscribe');

    page.close();
  }

  browser.close();
}

module.exports = unsubscribeFlow;
