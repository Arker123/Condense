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
let url = "http://127.0.0.1:3000/signup";
let TIMEOUT = 60000;

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("done");
    }, ms);
  });
};

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true, //false to view the window
    ignoreHTTPSErrors: true,
    slowMo: 50,
    args: [`--window-size=${800},${680}`],
  });
  page = await browser.newPage();
  await page.goto(url);
}, TIMEOUT);

afterEach(async () => {
  await browser.close();
}, TIMEOUT);

describe("Testing user creation functionality", () => {
  const emailIDSelector = 'input[id="email"]';
  const usernameSelector = 'input[id="username"]';
  const passwordSelector = 'input[id="password"]';
  const confirmPasswordSelector = 'input[id="confirmPassword"]';
  const signUpButtonSelector = 'button ::-p-text(Sign Up)';
  const registerTabSelector = 'div[data-testid="Register-header-test"]';

  test.skip("while registering, should display errors if input fields are empty", async () => {
    const registerTab = await page.waitForSelector(registerTabSelector);
    expect(registerTab).toBeTruthy();
    await page.click(registerTabSelector, { clickCount: 1 });

    await page.waitForSelector(signUpButtonSelector);
    await page.locator(signUpButtonSelector).hover();
    await page.click(signUpButtonSelector, { clickCount: 1 });
    await delay(1000);
    const emailErrorSelector = "div ::-p-text(Email is required.)";
    const emailError = await page.waitForSelector(emailErrorSelector);
    expect(emailError).toBeTruthy();
    

    await page.waitForSelector(emailIDSelector);
    await page.type(emailIDSelector, "e2etesting@gmail.com");
    await page.locator(signUpButtonSelector).hover();
    await page.click(signUpButtonSelector, { clickCount: 1 });
    await delay(1000);
    const nameErrorSelector = "div ::-p-text(Name is required.)";
    const nameError = await page.waitForSelector(nameErrorSelector);
    expect(nameError).toBeTruthy();

    await page.waitForSelector(usernameSelector);
    await page.type(usernameSelector, "E2E Tester");
    await page.locator(signUpButtonSelector).hover();
    await page.click(signUpButtonSelector, { clickCount: 1 });
    await delay(1000);
    const passwordErrorSelector = "div ::-p-text(Password is required.)";
    const passwordError = await page.waitForSelector(passwordErrorSelector);
    expect(passwordError).toBeTruthy();

    
    await page.waitForSelector(passwordSelector);
    await page.type(passwordSelector, "L4n4Pd07");
    await page.locator(signUpButtonSelector).hover();
    await page.click(signUpButtonSelector, { clickCount: 1 });
    await delay(1000);
    const confirmPasswordErrorSelector = "div ::-p-text(Confirm Password is required.)";
    const confirmError = await page.waitForSelector(confirmPasswordErrorSelector);
    expect(confirmError).toBeTruthy();

  }, TIMEOUT);

  test.skip("should show error if user already exists", async () => {
    const registerTab = await page.waitForSelector(registerTabSelector);
    expect(registerTab).toBeTruthy();
    await page.click(registerTabSelector, { clickCount: 1 });
    await page.waitForSelector(emailIDSelector);
    await page.type(emailIDSelector, "e2etesting@gmail.com");
    await page.waitForSelector(usernameSelector);
    await page.type(usernameSelector, "E2E Tester");
    await page.waitForSelector(passwordSelector);
    await page.type(passwordSelector, "L4n4Pd07");
    await page.waitForSelector(confirmPasswordSelector);
    await page.type(confirmPasswordSelector, "L4n4Pd07"); //L4n4Pd07
    
    await page.locator(signUpButtonSelector).hover();
    await page.click(signUpButtonSelector, { clickCount: 1 });
    await delay(1000);
    const existingUserErrorSelector = "div ::-p-text(Error)";
    const existingUserError = await page.waitForSelector(existingUserErrorSelector);
    expect(existingUserError).toBeTruthy();
    
  }, TIMEOUT);

});


