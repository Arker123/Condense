const puppeteer = require('puppeteer');

// Function to test transcript visibility
async function testTranscriptVisibility(page) {
  // Click on the transcript button
  await page.click('#t-button');
  // Wait for the transcript to become visible
  const transcriptVisible = await page.waitForSelector('#transcript', { visible: true });
  // Assert that the transcript is visible
  console.assert(transcriptVisible, 'Transcript visibility test failed.');
  console.log('Transcript visibility test passed.');
}

// Function to test notes functionality
async function testNotesFunctionality(page) {
  // Click on the notes button
  await page.click('#notes-button');
  // Wait for the notes entry box to become visible
  await page.waitForSelector('#notes-entry', { visible: true });
  // Type a test note into the notes entry box
  await page.type('#notes-entry-box', 'Test note');
  // Click on the button to add the note
  await page.click('#notes-entry-button');
  // Wait for the note to be added
  const noteAdded = await page.waitForFunction(
    () => document.querySelector('.notes-text-card')?.textContent.includes('Test note'),
    { timeout: 5000 }
  );
  // Assert that the note was added successfully
  console.assert(noteAdded, 'Note entry test failed.');
  console.log('Note entry test passed.');
}

// Function to test AI chat functionality
async function testAIChatFunctionality(page) {
  // Click on the AI chat button
  await page.click('#ai-chat-button');
  // Wait for the AI chat entry box to become visible
  await page.waitForSelector('#ai-chat-entry', { visible: true });
  // Type a message into the AI chat entry box
  await page.type('#ai-chat-entry-box', 'Hello');
  // Click on the button to send the message
  await page.click('#ai-chat-entry-button');
  // Wait for the AI response to be received
  const aiResponseReceived = await page.waitForFunction(
    () => document.querySelector('.answer-card')?.textContent.length > 0,
    { timeout: 5000 }
  );
  // Assert that the AI response was received
  console.assert(aiResponseReceived, 'AI Chat response test failed.');
  console.log('AI Chat response test passed.');
}

// Function to test summary generation
async function testSummaryGeneration(page) {
  // Click on the summary button
  await page.click('#summary-button');
  // Wait for the summary to be generated
  const summaryGenerated = await page.waitForFunction(
    () => document.querySelector('#summary-area')?.textContent.includes('Expected summary content'),
    { timeout: 5000 }
  );
  // Assert that the summary was generated successfully
  console.assert(summaryGenerated, 'Summary generation test failed.');
  console.log('Summary generation test passed.');
}

// Main function to run tests
(async () => {
  // Launch Puppeteer browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Load the HTML file containing the tested elements
  const filePath = `file://${__dirname}/index.html`;
  await page.goto(filePath);
  await page.waitForSelector('#ext-container');

  // Run each test
  await testTranscriptVisibility(page);
  await testNotesFunctionality(page);
  await testAIChatFunctionality(page);
  await testSummaryGeneration(page);

  // Close the browser
  await browser.close();
})();