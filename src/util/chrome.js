const launchChrome = require('@serverless-chrome/lambda');
const request = require('request-promise');
const puppeteer = require('puppeteer');
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

  log('Successfully retrieved socked endpoint url');
  return  {
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
async function getClick(page, selector) {
  return await page.evaluate((elementSelector) =>
    document.querySelector(elementSelector).click(), selector);

}


/**
 * Initiate unsubscribe flow to unsubscribe users from marketing emails
 *
 * @returns {Promise<void>}
 */

async function unsubscribeFlow(url) {
  const chrome = await getChrome();
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});

  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.goto(url);
  await page.waitFor(1000);
  console.log('Successfully loaded the homepage');
  const unsubHeader= await page.evaluate(() =>
    document.querySelector('#lp-pom-text-133 > h1 > span').innerHTML); //header
  console.log(unsubHeader);
  await page.type('#email', 'rbcventuresplatform@gmail.com'); //email text field
  console.log('Successfully typed email');
  await getClick(page, '#untitled3_please_unsubscribe_me_from_all_just_liv_promotional_emails');
  console.log('Successfully selected unsub checkbox');
  await page.waitFor(1000);
  await getClick(page, '#lp-pom-button-137 > span');
  console.log('Successfully submitted unsubscribe');

  browser.close();
}

module.exports = unsubscribeFlow;
