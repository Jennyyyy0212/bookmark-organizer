//triggeted when a profile that has this extension installed first starts up
chrome.runtime.onInstalled.addListener(() => {
    initialize();
});
  
  chrome.runtime.onStartup.addListener(() => {
    initialize();
});

function initialize () {
    chrome.storage.local.get("setupComplete", (data) => {
        if (!data.setupComplete) {
          // If setup is not complete, run setup.js
          import('./setup.js').then(({runSetup}) => {
              runSetup();
          });
          runBookmarkModule(); // After setup, transition to bookmark.js
        } else {
          // Setup is complete, run bookmark.js
          runBookmarkModule();
        }
      });
}

function runBookmarkModule() {
    import('./bookmark.js').then((module) => {
        module.addBook
    });
}