import { initialSetup } from './setup.js';
import { addBookMark } from './bookmark.js';

// Triggered when the extension is installed or updated
chrome.runtime.onInstalled.addListener(initialize);

// Triggered when the browser starts up
chrome.runtime.onStartup.addListener(() => {
    addBookMark(); // Always run addBookMark on startup
});

async function initialize() {
    chrome.storage.local.get("setupComplete", async ({ setupComplete }) => {
        if (!setupComplete) {
            // Run setup only if it hasn't been completed
            await initialSetup();
            console.log("initialized.");
        }

        // Always run addBookMark, even after setup
        addBookMark();
    });
}