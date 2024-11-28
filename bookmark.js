// handle new bookmark url
import { determineTag } from './testapi.js'; 

export async function handleNewBookmark(bookmark){
    // Skip processing if the item is a folder (folders have no URL)
    if (!bookmark.url) {
        console.log(`Skipping folder: ${bookmark.title}`);
        return;
    }

    try{
        const {tag: category, name} = await determineTag(bookmark);

        // Retrieve the folder dictionary from local storage
        chrome.storage.local.get("FoldersDict", (data) => {
            const folderDict = data.FoldersDict || {}; // Retrieve the dictionary

            // Check if a folder name exists for the category
            if (folderDict[category]) {
                // Folder exists, move the bookmark to the folder
                chrome.bookmarks.move(bookmark.id, { parentId: folderDict[category] });
            } else {
                console.error(`Folder "${category}" not found.`);
            }
        });

        chrome.runtime.sendMessage({action: "bookmarkUpdated", title: bookmark.title, label: category}, function(){
            console.log(`Moved bookmark "${bookmark.title}" to category "${category}".`);
        });
    } catch (error) {
        console.error("Error handling new bookmark:", error);
    }
}
