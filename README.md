# bookmark-organizer
AI-powered bookmark organizer that categorizes and tags bookmarks for easy retrieval. Users could search by tags or themes instead of manually organizing them.

# AI-Powered Bookmark Organizer

## Overview
A Chrome extension designed to automate bookmark management by leveraging advanced categorization and tagging techniques, enhancing productivity through seamless integration of backend logic and AI-powered functionality.

## Key Features
- **Automated Bookmark Organization**:  
  - Implemented logic to categorize and tag bookmarks dynamically for easy retrieval.  
  - Built using **Node.js**, **HTML**, **CSS**, and **JavaScript** for backend and frontend functionality.  

- **Gemini AI API Integration**:  
  - Integrated the **Gemini AI API** to automate bookmark organization, enabling search by tags or themes instead of manual sorting.  
  - Enhanced organization capabilities by analyzing bookmark content for accurate categorization.  

- **Backend Development**:  
  - Designed and implemented backend functionality in **Node.js** to handle API calls and bookmark data processing.  
  - Established seamless communication between the backend and the Chrome extension’s frontend interface.  

- **Frontend Development**:  
  - Created a responsive and intuitive interface using **HTML** and **CSS**.  
  - Designed the extension window for efficient user interactions, enabling quick access to categorized bookmarks.

## Technical Stack
- **Languages & Frameworks**: Node.js, JavaScript, HTML, CSS  
- **APIs**: Gemini AI API  
- **Tools**: Chrome Extension APIs (Manifest v3), Debugging and Testing Tools  

## Architecture
1. **Backend**:  
   - Processes bookmark data and API interactions using **Node.js**.  
   - Handles request-response cycles for AI-powered categorization.  

2. **Frontend**:  
   - Built with **HTML/CSS** for the extension interface.  
   - Provides users with categorized bookmark lists and a search interface.  

3. **API Integration**:  
   - Leverages the **Gemini AI API** for real-time bookmark classification.  

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository/bookmark-organizer.git
2. Navigate to the project directory and install dependencies:
   ```bash
   cd bookmark-organizer
   npm install

3. Load the extension into Chrome:
  - Open chrome://extensions/
  - Enable Developer Mode
  - Click Load Unpacked and select the project directory.
4. Configure the API key for the Gemini AI API in the environment file (.env).
