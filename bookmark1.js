// handle new bookmark url
import { determineTag } from './testapi.js'; 

export async function handleNewBookmark(bookmark){
    // Skip processing if the item is a folder (folders have no URL)
    if (!bookmark.url) {
        console.log(`Skipping folder: ${bookmark.title}`);
        return;
    }

    try{
        //const {tag: category, name} = await determineTag(bookmark);
        const category = "Study"

        // Retrieve the folder dictionary from local storage
        const data = await chrome.storage.local.get("FoldersDict");
        const folderDict = data.FoldersDict || {};
        
        // Check if a folder name exists for the category
        if (folderDict[category]) {
            // Folder exists, move the bookmark to the folder
            // Create the bookmark directly in the target folder
            chrome.bookmarks.create(
                { parentId: folderDict[category], title: bookmark.title, url: bookmark.url },
                (newBookmark) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error creating bookmark:", chrome.runtime.lastError);
                    } else {
                        console.log(
                            `Bookmark "${bookmark.title}" created in folder "${category}".`
                        );
                    }
                }
            );
            chrome.runtime.sendMessage({action: "bookmarkUpdated", title: bookmark.title, label: category}, function(){
                console.log(`Moved bookmark "${bookmark.title}" to category "${category}".`);
            });
        }
    } catch (error) {
        console.error("Error handling new bookmark:", error);
    }
}
