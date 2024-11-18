//main function for setup
export async function initialSetup() {
  console.log("Running initial setup...");

  //?? 
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "storeLabels") {
      const folderNames = [...request.labels, "Others"]; // Add "Others" to the list of folders

      // Create folders and populate the dictionary
      const folderPromises = folderNames.map((folderName) =>
        new Promise((resolve, reject) => {
          chrome.bookmarks.create({ title: folderName }, (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve({ id: result.id, name: folderName });
            }
          });
        })
      );


      Promise.all(folderPromises)
        .then((folders) => {
          const folderDict = folders.reduce((dict, folder) => {
            dict[folder.name] = folder.id;
            return dict;
          }, {});

          // Save the complete dictionary to storage after all folders are created
          chrome.storage.local.set({ setupComplete: true, FoldersDict: folderDict }, () => {
            console.log("Setup complete and folders saved.");
            sendResponse({ message: "Folders created successfully!" });
          });
        })
        .catch((error) => {
          console.error("Error creating folders:", error);
          sendResponse({ message: "Error creating folders.", error });
        });

      // Inform Chrome that the response will be sent asynchronously
      return true;
    }
  });
}