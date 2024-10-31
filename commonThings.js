
let data;

// Fetch the JSON data and display it
fetch('data.json')
    .then(response => response.json())
    .then(json => {
        data = json;
        // Check for localStorage data
        const storedData = localStorage.getItem('scraperData');
        if (storedData) {
            data = JSON.parse(storedData);
        }
        displayItems();
    })
    .catch(error => showPopup("Error loading data!"));

// Display functions, regex, and XPath from the data
function displayItems() {
    displayFunctions();
    displayRegex();
    displayXPaths();
}

// Display the functions in the UI
function displayFunctions() {
    const functionsList = document.getElementById('functions-list');
    functionsList.innerHTML = '';

    data.functions.forEach((func, index) => {
        const div = createItemDiv(func.name, func.code, index, 'function');
        functionsList.appendChild(div);
    });
}

// Display regex patterns in the UI
function displayRegex() {
    const regexList = document.getElementById('regex-list');
    regexList.innerHTML = '';

    data.regex.forEach((regex, index) => {
        const div = createItemDiv(regex.name, regex.pattern, index, 'regex');
        regexList.appendChild(div);
    });
}

// Display XPath expressions in the UI
function displayXPaths() {
    const xpathsList = document.getElementById('xpaths-list');
    xpathsList.innerHTML = '';

    data.xpaths.forEach((xpath, index) => {
        const div = createItemDiv(xpath.name, xpath.expression, index, 'xpath');
        xpathsList.appendChild(div);
    });
}

// Create a div element for each function/regex/xpath
function createItemDiv(name, code, index, type) {
    const div = document.createElement('div');
    div.classList.add('item');

    const title = document.createElement('h3');
    title.textContent = name;
    div.appendChild(title);

    const textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.id = `${type}-${index}`;
    textarea.setAttribute('oninput', 'adjustHeight(this)');  // Adjust height based on content
    adjustHeight(textarea);  // Call it once to adjust height on page load
    div.appendChild(textarea);

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.onclick = () => copyToClipboard(textarea.value);
    div.appendChild(copyButton);

    const editButton = document.createElement('button');
    editButton.textContent = 'Save';
    editButton.onclick = () => saveItem(index, textarea.value, type);
    div.appendChild(editButton);

    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteItem(index, type);
    div.appendChild(deleteButton);


    return div;
}



// Adjust the height of textarea based on content
function adjustHeight(textarea) {
    textarea.style.height = 'auto';  // Reset height
    textarea.style.height = textarea.scrollHeight + 'px';  // Set it according to scroll height
}


// Function to show pop-up notification
function showPopup(message) {
    console.log("Showing popup");  // Debugging log
    const popup = document.getElementById('popup');

    if (!popup) {
        console.error('Popup element not found!');
        return;
    }

    popup.textContent = message;
    popup.classList.remove('hidden');
    popup.classList.add('show');

    // Remove after 3 seconds
    setTimeout(() => {
        popup.classList.add('hidden');
        popup.classList.remove('show');
        console.log('Popup hidden');  // Debugging log
    }, 3000);
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showPopup('Copied to clipboard!');
        
        console.log("Copied " + text)
    }).catch(err => {
        showPopup('Failed to copy!');
        console.log("Failed to copy " + text)
    });
}

// Save an item (function, regex, or XPath)
function saveItem(index, newValue, type) {
    if (type === 'function') {
        data.functions[index].code = newValue;
    } else if (type === 'regex') {
        data.regex[index].pattern = newValue;
    } else if (type === 'xpath') {
        data.xpaths[index].expression = newValue;
    }

    saveData();
    showPopup('Item saved!');
}

// Add a new item
function addNewItem(type) {
    // Show modal for input
    document.getElementById('modal').style.display = 'flex';
    const modalTitle = document.getElementById('modal-title');
    const modalType = document.getElementById('modal-type');
    const modalCode = document.getElementById('modal-code');

    modalTitle.textContent = `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    modalType.value = type;
    modalCode.value = '';
}

// Function to delete an item
function deleteItem(index, type) {
    if (confirm('Are you sure you want to delete this item?')) {
        if (type === 'function') {
            data.functions.splice(index, 1);
            displayFunctions();
        } else if (type === 'regex') {
            data.regex.splice(index, 1);
            displayRegex();
        } else if (type === 'xpath') {
            data.xpaths.splice(index, 1);
            displayXPaths();
        }
        saveData();
        showPopup('Item deleted successfully!');
    }
}

// Handle the modal submission
function submitModal() {
    const type = document.getElementById('modal-type').value;
    const name = document.getElementById('modal-name').value;
    const code = document.getElementById('modal-code').value;

    if (!name || !code) {
        showPopup('Name and code are required!');
        return;
    }

    if (type === 'function') {
        data.functions.push({ name: name, code: code });
        displayFunctions();
    } else if (type === 'regex') {
        data.regex.push({ name: name, pattern: code });
        displayRegex();
    } else if (type === 'xpath') {
        data.xpaths.push({ name: name, expression: code });
        displayXPaths();
    }

    saveData();
    showPopup('New item added!');
    closeModal();
}

// Save the updated data to localStorage
function saveData() {
    localStorage.setItem('scraperData', JSON.stringify(data));
}


// Close the modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Event listener for modal submit button
document.getElementById('modal-submit').onclick = submitModal;
document.getElementById('modal-close').onclick = closeModal;

// Function to show pop-up notification