// handle new bookmark url
export function handleNewBookmark(bookmark){
    // Skip processing if the item is a folder (folders have no URL)
    if (!bookmark.url) {
        console.log(`Skipping folder: ${bookmark.title}`);
        return;
    }
    const category = determineCategory(bookmark.url); // define your categorize function

    // Retrieve the folder dictionary from local storage
    chrome.storage.local.get("FoldersDict", (data) => {
        const folderDict = data.FoldersDict; // Fallback to an empty object // Retrieve the dictionary

        // Check if a folder name exists for the category
        if (folderDict[category]) {
            // Folder exists, move the bookmark to the folder
            chrome.bookmarks.move(bookmark.id, { parentId: folderDict[category] });
        } else {
            // Handle bookmarks without a matching folder
            const otherCategory = "Others"; // Default folder for uncategorized bookmarks

            if (folderDict[otherCategory]) {
                // Move to the "Others" folder if it exists
                chrome.bookmarks.move(bookmark.id, { parentId: folderDict[otherCategory] });
            }
        }
    });

    chrome.runtime.sendMessage({action: "bookmarkUpdated", title: bookmark.title, label: category}, function(){
        console.log(`Moved bookmark "${bookmark.title}" to category "${category}".`);
    });
}

// Function to categorize bookmarks based on the URL
function determineCategory(url){
    return "Study" //debug
}

