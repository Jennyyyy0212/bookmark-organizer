// parse the response from the language model API
async function parseResponse(text) {
    try {
        if (!text) {
            console.error("Empty response");
            return null;
        }
        
        console.log("Raw response text:", text);
        

        // extract tag and summary from response
        const tagMatch = text.match(/Tag:\s*(\w+)/i);
        const summaryMatch = text.match(/Summary:\s*(.+?)(?=\n|$)/i);
        
        if (!tagMatch || !summaryMatch) {
            console.error("Failed to extract tag or summary from response");
            return null;
        }
        
        const tag = tagMatch[1].trim();
        const summary = summaryMatch[1].trim();
        
        console.log("Extracted tag:", tag);
        console.log("Extracted summary:", summary);
        
        return {
            tag: tag,
            summary: summary
        };
    } catch (error) {
        console.error("Error parsing response:", error);
        return null;
    }
}

// main function to determine tag and summary for a bookmark
export async function determineTag(bookmark) {
    try {
        // check if prompt API is available
        if (!('ai' in self)) {
            console.error("Prompt API not supported");
            alert("Prompt API is not supported in your browser");
            return { tag: "Others", name: bookmark.title };
        }


        // check if API is capable of processing the request
        const capabilities = await ai.languageModel.capabilities();
        console.log("API Capabilities:", capabilities);

        if (capabilities.available === "no") {
            console.error("Language model unavailable");
            alert("Language model unavailable");
            return { tag: "Others", name: bookmark.title };
        }


        // create a new session
        const session = await ai.languageModel.create({
            systemPrompt: "You are a direct and concise assistant that analyzes URLs and categorizes them appropriately. " 
        });

        if (!session) {
            console.error("Failed to create session");
            return { tag: "Others", name: bookmark.title };
        }

        
        // function to get the user's customized tags from storage
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
        const tags = await getTags(); 
        console.log("Available Tags:", tags);  

        // send prompt to API
        const prompt = `
            Analyze: ${bookmark.url}
            Choose exactly one most relevant tag from: ${tags.join(", ")}
            
            Respond in this format:
            Tag: [chosen tag]
            Summary: [Direct and highly specific description of the content, 
            should be concise, memorable, 
            and accurately reflect the reason why I'm saving this page at the moment
            (for example, if it's a webpage about black friday deals 
            and saved during black friday season, 
            you should include 'black friday deal' in the bookmark name)]
            
            Example response:
            Tag: Technology
            Summary: Google Chrome developer documentation for building web applications.
        `;

        console.log("Sending prompt to API:", prompt);


        // use the non-stream at once version to get the full response
        const result = await session.prompt(prompt);
        console.log("API raw response:", result);

        if (!result) {
            console.error("API returned empty or invalid response");
            return { tag: "Others", name: bookmark.title };
        }


        // prase the response
        const parsed = await parseResponse(result);
        if (parsed) {
            console.log("Parsed response:", parsed);
            return { tag: parsed.tag, name: parsed.summary };
        } else {
            console.error("Failed to parse response");
            return { tag: "Others", name: bookmark.title };
        }
    } catch (error) {
        console.error("Error during determineTag execution:", error);
        return { tag: "Others", name: bookmark.title };
    }
}