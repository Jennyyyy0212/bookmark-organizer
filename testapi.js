export async function determineTag(bookmark) {

    if(!('ai' in self)){
        // error for developer
        console.error("This API only works in Chrome with prompt API");
        // error for users
        alert("Prompt API is not supported in your browser. Please use a compatible version of Chrome.");
        return { tag: "Others", name: bookmark.title };
    }

    // extract content of webpage
    const title = document.querySelector('title')?.innerText || bookmark.title || 'No title found';
    const metaDescription = document.querySelector('meta[name="description"]')?.content || 'No Description Found';
    console.log("Title:", title);
    console.log("Meta Description:", metaDescription);

    // ensure the language model is ready for use
    const {available, defaultTemperature, defaultTopK, maxTopK } = await ai.languageModel.capabilities();
    console.log("Available Capabilities:", available);
    if (available === "no") {
        console.error("Language model is not available.");
        return { tag: "Others", name: bookmark.title };
    }

    // function to get the user tags from storage
    async function getTags() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(["FoldersDict"], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    const folderDict = result.FoldersDict || {};
                    const tagNames = Object.keys(folderDict); 
                    resolve(tagNames); 
                }
            });
        });
    }
    

    try {

        const tags = await getTags(); 
        console.log("Available Tags:", tags);          

        const session = await ai.languageModel.create();
        const prompt = `
            Based on the webpage details provided below:
            title of the url: ${title}
            meta description of the url: ${metaDescription}

            Analyze carefully and deeply what these tags mean 
            and then accurately classify the webpage only into one of these categories:
            ${tags.join(", ")}

            Generate a highly specific bookmark name for this page.
            Consider the following factors: 
            time sensitivity, key benefits, personal interests, and overall tone. 
            The bookmark name should be concise, memorable, 
            and accurately reflect the reason why I'm saving this page at the moment
            (for example, if it's a webpage about black friday deals 
            and saved during black friday season, 
            you should include 'black friday deal' in the bookmark name)
            Format your response only as:
            Recommended Bookmark Name: [Generated name]
            Selected Tag: [${tags.join(", ")}]
        `;

        const result = await session.prompt(prompt);
        if (!result || !result.text) {
            // stop the program and throw the error to developers
            throw new Error("Empty response from language model.");
        }
        // console.log(result);

        const name = result.text.match(/Recommended Bookmark Name:\s*(.*)/)?.[1]?.trim();
        const tag = result.text.match(/Selected Tag:\s*(.*)/)?.[1]?.trim();

        if (!name || !tag) {
            throw new Error("Invalid response format.");
        }

        console.log("Generated Name:", name);
        console.log("Selected Tag:", tag);

        return { tag, name };
    } catch (err) {
        console.error("Error during prompt generation:", err);
        return { tag: "Others", name: bookmark.title };  // 理论上不会触发，仅作为兜底
    } finally {
        session.destroy();
    }
}

