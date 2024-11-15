//main function for setup
function initialSetup() {
    
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "createFolders") {
          const { folderNames } = request;
      
          folderNames.forEach((folderName) => {
            chrome.bookmarks.create({ title: folderName }, () => {
                console.log(`Folder created: ${folderName}`);
            });
          });
      
          // Save the setup status in storage
          chrome.storage.local.set({ setupComplete: true, createdFolders: folderNames }, () => {
            console.log("Setup complete and folders saved.");
            sendResponse({ message: "Folders created successfully!" });
          });
      
          // Keep the sendResponse channel open for async response
          return true;
        }
      });
  
    // Mark setup as complete
    chrome.storage.local.set({ setupComplete: true }, () => {
        //should print sth out?
        console.log("Initial setup complete.");
    });
}