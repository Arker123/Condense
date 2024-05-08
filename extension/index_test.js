const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    // Launch a headless browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Get the absolute file path and convert it to URL format
    const filePath = path.join(__dirname, 'index.html');
    const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;

    // Load your extension's HTML file using the file URL
    await page.goto(fileUrl);

    // Test for correct title
    const title = await page.title();
    console.log(`Title: ${title}`);
    if (title === 'Condense Extension') {
        console.log('Title Test Passed');
    } else {
        console.error('Title Test Failed');
    }

    // Test for a specific element by its class or ID
    const header = await page.$eval('.header-logo', el => el.alt);
    if (header === 'Logo') {
        console.log('Logo Test Passed');
    } else {
        console.error('Logo Test Failed');
    }

    // Test click functionality of a specific card
    await page.click('.card:nth-child(1)');

    // Add other tests based on your HTML elements and functionality
    // For instance, checking visibility of certain sections

    // Close the browser instance
    await browser.close();
})();