//main fuunction after setting up
function addBookMark(){
    chrome.bookmarks.onCreated.addListener((_, bookmark) => {
        // Log the URL of the newly created bookmark
        //console.log("New Bookmark Added:", bookmark.url);
        handleNewBookmark(bookmark)
    })
    
}

// handle new bookmark url
function handleNewBookmark(bookmark){
    const category = determineCategory(bookmark.url); // define your categorize function
    // Check if a folder for the category already exists
    chrome.bookmarks.search({ title: category }, (results) => {
        let folder = results.find(result => result.title === category && !result.url)

        if (folder){
            // Folder exists, move bookmark into the exact match folder
            chrome.bookmarks.move(bookmark.id, {parentId: folder.id});
            console.log(bookmark.title, category); 
        } else {
            // Show the folder if no exact match is found 
            // can add here a way to solve the not found folder in the future
            let other = "others" //Other folder name - can change
            //or can record the other folder ID on local and reuse the id directly
            let otherFolder = results.find(result => result.title === other && !result.url)
            if (otherFolder){
                chrome.bookmarks.move(bookmark.id, {parentId: folder.id});
                console.log(bookmark.title, other); 
            } else {
                chrome.bookmarks.create({ title: other }, (newFolder) => {
                    chrome.bookmarks.move(bookmark.id, { parentId: newFolder.id });
                    console.log(bookmark.title, other); 
                });
            }
        }
    });
}

// Function to categorize bookmarks based on the URL
function determineCategory(url){

}

