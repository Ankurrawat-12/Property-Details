const checklistFields = {
    "General Property Info": [
        "company_name", "property_title", "property_address", "postcode", "house_number", 
        "city", "road", "state_district", "house", "city_district", "state", "country", 
        "suburb", "unit", "level", "category", "near", "property_type", "property_description",
        "property_map_coordinates", "property_size", "property_size_numerical", "property_size_text", 
        "date_added"
    ],
    "Property Pricing Info": [
        "property_sale_price", "property_sale_price_numerical", "property_sale_price_text", 
        "property_rent_details", "property_rent_details_numerical", "property_rent_details_text"
    ],
    "Property Features": [
        "property_amenities", "property_images", "property_office", "property_status"
    ],
    "Agent Info": [
        "agent_name", "agent_name2", "agent_name3", "agent_telephone", "agent_telephone2", 
        "agent_telephone3", "agent_email", "agent_email2", "agent_email3", "agent_designation", 
        "agent_designation2", "agent_designation3", "agent_address"
    ],
    "Lease Info": [
        "lease_expiry", "lease_expiry_date", "lease_start", "lease_text_raw"
    ],
    "Additional Info": [
        "rateable_value", "rates_payable", "net_yield", "title_number", "use_class", "service_charge", 
        "epc_rating", "epc_band", "epc_link", "passing_rent", "passing_rent_text"
    ],
    "Tenant Info": [
        "unit_name", "tenant_name", "floor", "unit_area", "tenant_lease_start", 
        "tenant_lease_expiry", "tenant_passing_rent", "tenant_break_date", "tenant_rent_review_date", 
        "tenant_comments", "tenant_covenants_name", "tenant_covenant_financial_year", 
        "tenant_covenant_turnover", "tenant_covenant_pre_tax_profit_loss", 
        "tenant_covenant_net_assets", "tenant_covenant_comments"
    ],
    "Media and Files": [
        "file_urls", "files", "parent_listing_id", "parent_listing_ref_id"
    ]
};

function createChecklist() {
    const propertyName = document.getElementById("propertyName").value;
    const propertyURL = document.getElementById("propertyURL").value;

    if (!propertyName || !propertyURL) {
        alert("Please enter a property name and URL.");
        return;
    }

    const checklistContainer = document.getElementById("checklistContainer");
    checklistContainer.innerHTML = "";  // Clear previous content

    const checklistDiv = document.createElement("div");
    checklistDiv.classList.add("propertyChecklist");

    checklistDiv.innerHTML = `<h3><a href="${propertyURL}" target="_blank">${propertyName} Checklist</a></h3>`;

    Object.keys(checklistFields).forEach(section => {
        const sectionTitle = document.createElement("h4");
        sectionTitle.textContent = section;
        checklistDiv.appendChild(sectionTitle);

        const sectionDiv = document.createElement("div");
        sectionDiv.classList.add("checklistSection");

        checklistFields[section].forEach(field => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            const span = document.createElement("span");
            span.textContent = field;

            checkbox.addEventListener("change", function() {
                if (checkbox.checked) {
                    span.style.textDecoration = "line-through";
                    span.style.color = "#aaa";
                } else {
                    span.style.textDecoration = "none";
                    span.style.color = "#555";
                }
            });

            label.appendChild(checkbox);
            label.appendChild(span);
            sectionDiv.appendChild(label);
        });

        checklistDiv.appendChild(sectionDiv);
    });

    checklistContainer.appendChild(checklistDiv);
    document.getElementById("propertyName").value = "";  // Clear input after adding
    document.getElementById("propertyURL").value = "";   // Clear input after adding
}

// Function to add the functions to the webpage
function addFunction() {
    const functionInput = document.getElementById("functionInput").value;
    if (!functionInput) {
        alert("Please paste your function first!");
        return;
    }
    alert("Function added successfully!");
    document.getElementById("functionInput").value = ""; // Clear input after adding
}

// Function to save functions to local storage
function saveFunction() {
    const functions = document.getElementById("functionInput").value;
    if (!functions) {
        alert("Please paste your function first.");
        return;
    }
    localStorage.setItem('propertyFunctions', functions);
    alert("Functions saved locally!");
}

// Function to load functions from local storage
function loadFunction() {
    const savedFunctions = localStorage.getItem('propertyFunctions');
    if (savedFunctions) {
        document.getElementById("functionInput").value = savedFunctions;
        alert("Functions loaded from local storage!");
    } else {
        alert("No saved functions found.");
    }
}

// Save the checklist data to a JSON file
function saveChecklistToFile() {
    const checklistContainer = document.getElementById('checklistContainer');
    const checklistData = {};

    // Loop through each section and each checklist item
    document.querySelectorAll('.checklistSection').forEach(section => {
        const sectionTitle = section.getAttribute('data-section');
        checklistData[sectionTitle] = {};

        section.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            const itemLabel = checkbox.nextElementSibling.textContent;
            checklistData[sectionTitle][itemLabel] = checkbox.checked;
        });
    });

    // Create a blob from the checklist data and download it as a file
    const blob = new Blob([JSON.stringify(checklistData, null, 2)], { type: 'application/json' });
    const filename = prompt("Enter a filename to save the checklist:", "property-checklist.json");

    if (filename) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename.endsWith('.json') ? filename : filename + '.json';
        link.click();
        showPopup(`Checklist saved to ${filename}`);
    } else {
        showPopup('Save cancelled.');
    }
}

// Load checklist data from a specified JSON file
function loadChecklistFromFile() {
    const filename = prompt("Enter the filename of the checklist to load:", "property-checklist.json");

    if (!filename) {
        showPopup('Load cancelled.');
        return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file && file.name === filename) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const checklistData = JSON.parse(e.target.result);
                    populateChecklist(checklistData);
                    showPopup(`Checklist loaded from ${filename}`);
                } catch (error) {
                    showPopup('Error loading checklist. Invalid JSON file.');
                }
            };
            reader.readAsText(file);
        } else {
            showPopup(`File "${filename}" not found or selected.`);
        }
    };

    input.click();
}

// Populate the checklist with data
function populateChecklist(data) {
    // Loop through each section and each checklist item
    document.querySelectorAll('.checklistSection').forEach(section => {
        const sectionTitle = section.getAttribute('data-section');
        const sectionData = data[sectionTitle] || {};

        section.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            const itemLabel = checkbox.nextElementSibling.textContent;
            checkbox.checked = sectionData[itemLabel] || false;
        });
    });
}
