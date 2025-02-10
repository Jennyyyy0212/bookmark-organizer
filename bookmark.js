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
        // const category = "Study" change1

        // Retrieve the folder dictionary from local storage
        const data = await chrome.storage.local.get("FoldersDict");
        const folderDict = data.FoldersDict || {};
        
        // Check if a folder name exists for the category
        if (folderDict[category]) {
            // Folder exists, move the bookmark to the folder
            // Create the bookmark directly in the target folder
            chrome.bookmarks.create(
                { parentId: folderDict[category], title: name, url: bookmark.url }, // change 2 : title > name
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
            chrome.runtime.sendMessage({action: "bookmarkUpdated", title: name, label: category}, function(){ // change 3 and 4: title > name
                console.log(`Moved bookmark "${name}" to category "${category}".`);
            });
        } else {
            console.log(`Cannot find folder "${category}". Move the bookmark to "Others" folder`);
            chrome.bookmarks.create(
                { parentId: folderDict["Others"], title: name, url: bookmark.url }, // change 2 : title > name
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
            chrome.runtime.sendMessage({action: "bookmarkUpdated", title: name, label: category}, function(){ // change 3 and 4: title > name
                console.log(`Moved bookmark "${name}" to category "Others".`);
            });
        }
    } catch (error) {
        console.error("Error handling new bookmark:", error);
    }
}
