import { createFolders } from './setup.js';
import { handleNewBookmark } from './bookmark.js';

// Attach bookmark event listener at the top level
// main function after setting up
// Attach bookmark event listener at the top level
chrome.bookmarks.onCreated.addListener(bookmarkCreatedHandler);

function bookmarkCreatedHandler(id, bookmark) {
    chrome.bookmarks.onCreated.removeListener(bookmarkCreatedHandler);
    setTimeout(() => {
        console.time("CreateNewBookmarkTime");
        console.log(`New bookmark created: ${bookmark.title} (${bookmark.url})`);
        handleNewBookmark(bookmark).finally(() => {
            console.timeEnd("CreateNewBookmarkTime");
            //re-add lisitener
            chrome.bookmarks.onCreated.addListener(bookmarkCreatedHandler);
        });
    }, 5000); 

    //Delete the original bookmark created by Chrome
    if (bookmark.url){
        chrome.bookmarks.remove(id);
        console.log("Deleted original bookmark and added categorized version.");
    }
}


// Triggered when the extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install"){
        chrome.action.openPopup();
        //initilaize the folder after opening the popup
        console.time("SetupTime");
        initialize();
        console.timeEnd("SetupTime");
    }
});

// Triggered when the browser starts up
chrome.runtime.onStartup.addListener(() => {
    console.log("Extension started up");
});

// Initialization function
async function initialize() {
    // Initialization and Message Handling
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "storeLabels") {
            // Check if setup is complete
            chrome.storage.local.get("setupComplete", async ({ setupComplete }) => {
                if (!setupComplete) {
                    console.log("Setup not complete. Running initial setup...");

                    // Create folders based on labels provided in the request
                    await createFolders([...request.labels, "Others"]);

                    // Mark setup as complete
                    chrome.storage.local.set({ setupComplete: true }, () => {
                        console.log("Setup marked as complete.");
                        sendResponse({ message: "Folders created successfully!" });
                    });
                } else {
                    console.log("Setup already complete. Skipping folder creation.");

                    // Optionally handle repeated folder creation requests if required
                    sendResponse({ message: "Setup is already complete. No folders created." });
                }
            });

            return true; // Indicate asynchronous response
        }
    });

}
