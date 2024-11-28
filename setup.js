//main function for setup
export async function createFolders(folderNames) {
  console.log("Creating folders:", folderNames);

  // joanne: 确保 "Others" 文件夹总是存在
  if (!folderNames.includes("Others")) {
        folderNames.push("Others");
  }

  // Create folders and populate the dictionary
  const folderPromises = folderNames.map(
      (folderName) =>
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

  try {
      const folders = await Promise.all(folderPromises);
      const folderDict = folders.reduce((dict, folder) => {
          dict[folder.name] = folder.id;
          return dict;
      }, {});

      // Save folder dictionary to storage
      chrome.storage.local.set({ FoldersDict: folderDict }, () => {
          console.log("Folders saved:", folderDict);
      });
  } catch (error) {
      console.error("Error creating folders:", error);
  }
}
