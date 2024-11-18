document.getElementById('done-button').addEventListener('click', function() {
    const labels = [];
    const labelElements = document.getElementsByName('label');
    labelElements.forEach(el => {
        if (el.checked) {
            labels.push(el.value);
        }
    });

    // get那些用户创造的新标签
    const newLabelElements = document.querySelectorAll('.new-label-input');
    newLabelElements.forEach(el => {
        if (el.value.trim() !== "") {
            labels.push(el.value.trim());
        }
    });

    console.log(labels);
    
    //发送labels to backend
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
    
    //添加新label到容器
    newLabelsContainer.appendChild(newLabelInput);
    newLabelsContainer.appendChild(document.createElement('br')); 
});

function updateBookmarkStatus(title, label) {
    const statusDiv = document.getElementById('bookmark-status');
    statusDiv.innerHTML = `${title} added into ${label}!`;
}

//接受后台信息
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "bookmarkUpdated") {
        updateBookmarkStatus(message.title, message.label);
    }
});