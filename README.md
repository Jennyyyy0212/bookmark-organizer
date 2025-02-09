
<h1 align='center'>AI-Powered Bookmark Organizer</h1>
<p align='center'>
  <img alt="jjj" src="https://img.shields.io/badge/version-1.0-blue">
  <img src="https://img.shields.io/badge/Hackathon-Project-purple" alt="Hackathon Project Badge">
  <img src="https://img.shields.io/badge/AI-Powered-green" alt="AI-Powered Badge">
  <img src="https://img.shields.io/badge/Chrome%20Extension-orange" alt="Chrome Extension Badge">
  <img src="https://img.shields.io/badge/Developer%20mode-red" alt="Developer Mode">
</p>
AI-powered bookmark organizer that categorizes and tags bookmarks for easy retrieval. Users could search by tags or themes instead of manually organizing them.


## Overview
A Chrome extension designed to automate bookmark management by leveraging advanced categorization and tagging techniques, enhancing productivity through seamless integration of backend logic and AI-powered functionality.

## Key Features
- Automated Bookmark Organization
- Gemini AI API Integration  
- Backend Development
- Frontend Development

## Technical Stack
- **Languages & Frameworks**: Node.js, JavaScript, HTML, CSS  
- **APIs**: Gemini AI API  
- **Tools**: Chrome Extension APIs (Manifest v3), Debugging and Testing Tools  

## Prerequisite 
1. Acknowledge [Google’s Generative AI Prohibited Uses Policy](https://policies.google.com/terms/generative-ai/use-policy).
2. Download [Canary channel](https://www.google.com/chrome/canary/), and confirm that your version is equal or newer than 128.0.6545.0.
3. Check that your device meets the [requirements](https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit#heading=h.cwc2ewfrtynq).
> ⚠️ Don’t skip this step, in particular make sure that you have at least 22 GB of free storage space.
> If after the download the available storage space falls below 10 GB, the model will be deleted again.
> Note that some operating systems may report the actual free disk space differently, for example, by including or not disk space that's occupied by the trash bin.
> On macOS, use Disk Utility to get the representative free disk space.
4. Enable Gemini Nano and the Prompt API

     Follow these steps to enable Gemini Nano and the Prompt API flags for local experimentation:

     1. Go to **chrome://flags/#prompt-api-for-gemini-nano**
     2. Select Enabled
     3. Relaunch Chrome.
5. Confirm availability of Gemini Nano

    1. Open DevTools and send **(await ai.languageModel.capabilities()).available;** in the console. 
    2. If this returns “readily”, then you are all set. 

    If this fails. check the [document](https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0#heading=h.93r8whrihtch) and follow the steps under **Setup** to debug and fix.


## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository/bookmark-organizer.git
2. Navigate to the project directory and install dependencies:
   ```bash
   cd bookmark-organizer
   npm install
   ```

3. Load the extension into Google Canary Chrome you just downloaded :
  - Open chrome://extensions/
  - Enable Developer Mode on the right top corner
  - Click Load Unpacked and select the project directory.

4. The extension will now appear in your Chrome toolbar.

## How to Use
### Initial Setup
After loading the extension, the popup window will show up.
1. Set up the initial folder where you want bookmarks to be organized.
2. The extension will automatically create this folder in Chrome’s bookmarks.

    > **Important**: If you already have a folder with the same name, delete it first before creating a new one through the extension to avoid conflicts.

### Adding Bookmarks

1. When you find a page you want to bookmark, click the bookmark star icon in the address bar.

    > **DO NOT** interact with the Google bookmark popup that appears because it might redirect the bookmark add into another folder. Instead, click anywhere outside the popup to close it.
2. Wait a seconds (normally run from 1s to 3s), and the extension will automatically categorize the page into the appropriate folder you set up earlier.

