/**
 * @jest-environment node
 */

const puppeteer = require("puppeteer");
let browser;
let page;
let baseurl = "http://127.0.0.1:3000/";
let url = "http://127.0.0.1:3000/signup";
let TIMEOUT = 40000;

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("done");
    }, ms);
  });
};

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

describe("Testing user login functionality", () => {
  const emailIDSelector = 'input[id="email"]';
  const passwordSelector = 'input[id="password"]';
  const loginButtonSelector = 'button';
  const registerTabSelector = 'div[data-testid="Register-header-test"]';
  const loginTabSelector = 'div[data-testid="Login-header-test"]';

  test("should have two tabs -> Login / SignUp with tab switching", async () => {
    const registerTab = await page.waitForSelector(registerTabSelector);
    expect(registerTab).toBeTruthy();
    await page.click(registerTabSelector, { clickCount: 1 });
    const loginTab = await page.waitForSelector(loginTabSelector);
    expect(loginTab).toBeTruthy();
    await page.click(loginTabSelector, { clickCount: 1 });
  });

  test("while logging in, should display errors if email or password is empty", async () => {
    await page.waitForSelector(loginButtonSelector);
    await page.click(loginButtonSelector, { clickCount: 1 });
    const emailErrorSelector = "div ::-p-text(Email is required.)";
    const emailError = await page.waitForSelector(emailErrorSelector);
    expect(emailError).toBeTruthy();
    await page.waitForSelector(emailIDSelector);
    await page.type(emailIDSelector, "e2etesting@gmail.com");
    await page.waitForSelector(loginButtonSelector);
    await page.click(loginButtonSelector, { clickCount: 1 });
    await delay(500);
    const passwordErrorSelector = "div ::-p-text(Password is required.)";
    const passwordError = await page.waitForSelector(passwordErrorSelector);
    expect(passwordError).toBeTruthy();
  }, TIMEOUT);

  test("should login successfuly and redirect to landing page if correct credentials", async () => {
    await page.waitForSelector(passwordSelector);
    await page.type(passwordSelector, "L4n4Pd07"); //L4n4Pd07
    await page.waitForSelector(loginButtonSelector);

    await Promise.all([
      page.waitForNavigation(),
      page.click(loginButtonSelector, { clickCount: 1 }),
    ]);

    const redirectedTo = await page.url();
    expect(redirectedTo).toEqual(baseurl + "landing");
  }, TIMEOUT);

});


