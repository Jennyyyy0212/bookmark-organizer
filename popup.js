document.getElementById('done-button').addEventListener('click', function() {
    const labels = [];
    const labelElements = document.getElementsByName('label');
    labelElements.forEach(el => {
        if (el.checked) {
            labels.push(el.value);
        }
    });

    // get new label
    const newLabelElements = document.querySelectorAll('.new-label-input');
    newLabelElements.forEach(el => {
        if (el.value.trim() !== "") {
            labels.push(el.value.trim());
        }
    });

    console.log(labels);
    
    //send labels to backend
    chrome.runtime.sendMessage({ action: "storeLabels", labels: labels }, function(response) {
        console.log(response.status);
    });
});


document.getElementById('add-label-button').addEventListener('click', function() {
    const newLabelsContainer = document.getElementById('new-labels-container');
    
    //new input
    const newLabelInput = document.createElement('input');
    newLabelInput.type = 'text';
    newLabelInput.className = 'new-label-input';
    newLabelInput.placeholder = 'Label Name';
    
    //add new label
    newLabelsContainer.appendChild(newLabelInput);
    newLabelsContainer.appendChild(document.createElement('br')); 
});

function updateBookmarkStatus(title, label) {
    const statusDiv = document.getElementById('bookmark-status');
    statusDiv.innerHTML = `${title} added into ${label}!`;
}

// receive message from backend
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "bookmarkUpdated") {
        updateBookmarkStatus(message.title, message.label);
    }
});