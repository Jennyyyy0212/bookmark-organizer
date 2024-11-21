(async () => {

    if(!('ai' in self)){
        // error for developer
        console.error("This API only works in Chrome with prompt API");
        // error for users
        alert("Prompt API is not supported in your browser. Please use a compatible version of Chrome.");
        return;
    }

    // extract content of webpage
    const title = document.querySelector('title')?.innerText || 'No title found';
    const metaDescription = document.querySelector('meta[name="description"]')?.content || 'No Description Found'
    console.log("Title:", title);
    console.log("Meta Description:", metaDescription);

    // make sure the language model is ready for use
    const languageModel = await ai.languageModel.capabilities();
    console.log("Available Capabilities:", available);
    if (available === "no") {
        console.error("Language model is not available.");
        return;
    }

    // function to get the user tags from storage api
    async function getTags() {
        return new Promise((resolve) => {
            chrome.storage.local.get(["userTags"], (result) => {
                // if there's data if userTags, get it; otherwise, ruturn an empty object
                resolve(result.userTags || {});
            });
        });
    }

    try {
        try {
            // get tags from storage API
            const tags = await getTags();
            const tagNames = Object.values(tags).map((tag) => tag.name);
            console.log("User-defined tag names:", tagNames);            
        } catch (err) {
            console.error("Error fetching tags:", err);
        }

        const prompt = `
            Based on the webpage details provided below:
            title of the url: ${title}
            meta description of the url: ${metaDescription}

            Analyze carefully and deeply what these tags mean 
            and then accurately classify the webpage only into one of these categories:
            ${tagNames}

            Generate a highly specific bookmark name for this page.
            Consider the following factors: 
            time sensitivity, key benefits, personal interests, and overall tone. 
            The bookmark name should be concise, memorable, 
            and accurately reflect the reason why I'm saving this page at the moment
            (for example, if it's a webpage about black friday deals, 
            you should include 'black friday deal' in the bookmark name)
            Format your response only as:
            Recommended Bookmark Name: [Generated name]
            Selected Tag: [Study, Work, or Other]
        `;

        const result = await languageModel.prompt(prompt);
        if (!result || !result.text) {
            // stop the program and throw the error to developers
            throw new Error("Empty response from language model.");
        }
        console.log(result);

        // // 将结果返回给 Bookmark API
        // const bookmarkData = {
        //     name: result.text.match(/Recommended Bookmark Name:\s*(.*)/)?.[1],
        //     tag: result.text.match(/Selected Tag:\s*(.*)/)?.[1],
        // };

        // chrome.runtime.sendMessage({ action: "saveBookmark", data: bookmarkData });
        
    } catch (err) {
        console.error("Error during prompt generation:", err);
    } finally {
        languageModel.destroy();
    }
})();

