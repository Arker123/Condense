/**
 * @jest-environment node
 */

/* 
Note: These e2e tests can only be run when we have either a local/online-deployed website (because their entry point is the WebURL). 
If online, change the baseurl below accordingly & unskip the tests to run.
*/
const puppeteer = require("puppeteer");
let browser;
let page;
let baseurl = "http://127.0.0.1:3000/";
let url = "http://127.0.0.1:3000/landing";
let TIMEOUT = 30000;

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("done");
    }, ms);
  });
}

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true, //false to view the window
    ignoreHTTPSErrors: true,
    slowMo: 70,
    args: [`--window-size=${800},${680}`], // add '--no-startup-window' '--enable-automation'
  });
  page = await browser.newPage();
  await page.goto(url);
}, TIMEOUT);

afterAll(async () => {
  await browser.close();
}, TIMEOUT);

describe("Testing summary generation functionality", () => {
  const emailIDSelector = 'input[id="email"]';
  const passwordSelector = 'input[id="password"]';
  const loginButtonSelector = "button ::-p-text(Login)";
  const getStartedButtonSelector = "a ::-p-text(Get started!)";
  const youtubeLinkInputSelector = 'input[type="link"]';
  const summarizeButtonSelector = "button ::-p-text(Start Summarizing)";

  test.skip(
    "on clicking get started -> should login successfuly and direct to summary page",
    async () => {
      await page.waitForSelector(getStartedButtonSelector);
      await page.locator(getStartedButtonSelector).hover();
      await Promise.all([
        page.waitForNavigation(),
        page.click(getStartedButtonSelector, { clickCount: 1 }),
      ]);
      var redirectedTo = await page.url();
      expect(redirectedTo).toEqual(baseurl + "signup");

      await page.waitForSelector(emailIDSelector);
      await page.type(emailIDSelector, "e2etesting@gmail.com");
      await page.waitForSelector(passwordSelector);
      await page.type(passwordSelector, "L4n4Pd07"); //L4n4Pd07
      await page.waitForSelector(loginButtonSelector);
      await Promise.all([
        page.waitForNavigation(),
        page.click(loginButtonSelector, { clickCount: 1 }),
      ]);
      await delay(1000);
      redirectedTo = await page.url();
      expect(redirectedTo).toEqual(baseurl + "dashboard");
    },
    TIMEOUT
  );

  test.skip("should redirect to summary page on giving input of youtube link", async () => {
    await page.waitForSelector(youtubeLinkInputSelector);
    await page.type(
      youtubeLinkInputSelector,
      "https://www.youtube.com/watch?v=seugK4PrW48"
    ); //https://www.youtube.com/watch?v=seugK4PrW48
    await page.waitForSelector(summarizeButtonSelector);
    await Promise.all([
      page.waitForNavigation(),
      page.click(summarizeButtonSelector, { clickCount: 1 }),
    ]);
    const redirectedTo = await page.url();
    expect(redirectedTo).toEqual(baseurl + "summary");
  }, TIMEOUT);

});
