// joanne
import { determineTag } from './testapi.js'; 

// joanne: just add the "async"
// handle new bookmark url 
export async function handleNewBookmark(bookmark){
    // Skip processing if the item is a folder (folders have no URL)
    if (!bookmark.url) {
        console.log(`Skipping folder: ${bookmark.title}`);
        return;
    }

    // joanne: add a try function outside and slightly change the codes inside
    try{
        const {tag: category, name} = await determineTag(bookmark);
        // Retrieve the folder dictionary from local storage
        chrome.storage.local.get("FoldersDict", (data) => {
            const folderDict = data.FoldersDict || {}; // Fallback to an empty object // Retrieve the dictionary

            const folderId = folderDict[category] || folderDict["Others"]; // 理论上不会使用 "Others"，但保留以防数据异常
            // Check if a folder name exists for the category
            if (folderId) {
                chrome.bookmarks.move(bookmark.id, { parentId: folderId }, () => {
                    console.log(`Moved bookmark "${name}" to category "${category}".`);
                });
            } else {
                console.error(`Default folder "Others" not found.`);
            }
        });

        chrome.runtime.sendMessage({action: "bookmarkUpdated", title: name, label: category}, () => {
            console.log(`Moved bookmark "${name}" to category "${category}".`);
    });
    } catch (error) {
        console.error("Error handling new bookmark:", error);
    }
}

