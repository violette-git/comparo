import {
    supabase,
    saveSiteEntry,
    getSiteEntries,
    updateSiteEntry,
    deleteSiteEntry
} from './supabase.js';

document.addEventListener('DOMContentLoaded', function() {
    // Get navigation buttons
    const showFormBtn = document.getElementById('show-form-btn');
    const showPreviewsBtn = document.getElementById('show-previews-btn');

    // Get page sections
    const formPage = document.querySelector('.form-page');
    const previewsPage = document.querySelector('.previews-page');

    // Get form elements
    const previewForm = document.getElementById('preview-form');
    const systemSelect = document.getElementById('system-select');
    const siteUrlInput = document.getElementById('site-url');
    const siteTitleInput = document.getElementById('site-title');
    const sitePromptInput = document.getElementById('site-prompt');
    const generateButton = document.getElementById('generate-btn');

    // Get preview elements on the previews page
    const manusPreviewContainer = document.getElementById('manus-preview-container');
    const rabbitOSPreviewContainer = document.getElementById('rabbitOS-preview-container');
    const manusIframePreview = document.getElementById('manus-iframe-preview');
    const rabbitOSIframePreview = document.getElementById('rabbitOS-iframe-preview');

    // Get metadata elements on the previews page
    const manusUrlPreview = document.getElementById('manus-url-preview');
    const manusTitlePreview = document.getElementById('manus-title-preview');
    const manusPromptPreview = document.getElementById('manus-prompt-preview');
    const rabbitOSUrlPreview = document.getElementById('rabbitOS-url-preview');
    const rabbitOSTitlePreview = document.getElementById('rabbitOS-title-preview');
    const rabbitOSPromptPreview = document.getElementById('rabbitOS-prompt-preview');

    // Get the entries container
    const entriesContainer = document.getElementById('entries-container');

    // Store form data and current entry ID
    let formData = {
        system: '',
        url: '',
        title: '',
        prompt: ''
    };
    let currentEntryId = null;

    // Function to show a specific page
    function showPage(page) {
        formPage.classList.remove('active');
        previewsPage.classList.remove('active');
        page.classList.add('active');

        if (page === previewsPage) {
            loadExistingEntriesForPreviewPage();
        }
    }

    // Event listeners for navigation
    showFormBtn.addEventListener('click', () => showPage(formPage));
    showPreviewsBtn.addEventListener('click', () => showPage(previewsPage));

    /**
     * Load existing entries from Supabase specifically for the preview page
     */
    async function loadExistingEntriesForPreviewPage() {
        const entriesContainer = document.getElementById('entriesContainer'); // Ensure this element exists in your HTML
    
        if (!entriesContainer) {
            console.error("Error: 'entriesContainer' element not found in the DOM.");
            return;
        }
    
        try {
            const { data, error } = await getSiteEntries();
    
            if (error) {
                console.error('Error loading entries:', error);
                entriesContainer.innerHTML = '<div class="alert alert-danger" role="alert">Error loading entries.</div>';
                return;
            }
    
            if (data && data.length > 0) {
                entriesContainer.innerHTML = '';
                data.forEach(entry => {
                    const entryDiv = document.createElement('div');
                    entryDiv.className = 'entry-card mb-4 shadow-sm rounded';
                    entryDiv.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title mb-2 text-primary">Entry ID: ${entry.id}</h5>
                            <p class="card-text mb-1"><strong>System:</strong> <span class="badge bg-secondary">${entry.system_type}</span></p>
                            <p class="card-text mb-1"><strong>URL:</strong> <a href="${entry.url}" target="_blank" class="text-decoration-none">${entry.url}</a></p>
                            <p class="card-text mb-1"><strong>Title:</strong> ${entry.title || '<span class="text-muted">N/A</span>'}</p>
                            <p class="card-text mb-2"><strong>Prompt:</strong> <span class="text-muted">${entry.prompt || 'N/A'}</span></p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <button class="btn btn-outline-info btn-sm view-preview-btn" data-entry-id="${entry.id}">
                                        <i class="bi bi-eye-fill me-1"></i> View Preview
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm delete-btn" data-entry-id="${entry.id}">
                                        <i class="bi bi-trash-fill me-1"></i> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id="preview-${entry.id}" class="preview-container p-3 border-top" style="display: none;">
                            <h6 class="mb-2">Website Preview:</h6>
                            <iframe src="" frameborder="0" style="width: 100%; height: 400px;"></iframe>
                            <div class="mt-2 text-center">
                                <button class="btn btn-secondary btn-sm close-preview-btn" data-entry-id="${entry.id}">Close Preview</button>
                            </div>
                        </div>
                    `;
                    entriesContainer.appendChild(entryDiv);
                });
            } else {
                entriesContainer.innerHTML = '<p>No existing entries found.</p>';
                if (typeof clearPreviews === 'function') {
                    clearPreviews();
                }
            }
        } catch (error) {
            console.error('Error in loadExistingEntriesForPreviewPage:', error);
            entriesContainer.innerHTML = '<div class="alert alert-danger" role="alert">Error loading existing entries.</div>';
            if (typeof clearPreviews === 'function') {
                clearPreviews();
            }
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        const entriesContainer = document.getElementById('entriesContainer');
    
        if (entriesContainer) {
            // Event listener for "View Preview", "Close Preview", and "Delete" buttons using event delegation
            entriesContainer.addEventListener('click', async function(event) {
                if (event.target.classList.contains('view-preview-btn')) {
                    const entryId = event.target.dataset.entryId;
                    const entryDiv = event.target.closest('.entry-card');
                    if (entryDiv) {
                        const previewContainer = entryDiv.querySelector(`#preview-${entryId}`);
                        const iframe = previewContainer.querySelector('iframe');
                        const entryData = await getEntryDataById(entryId); // Assuming you have a function to fetch single entry data
                        if (entryData) {
                            iframe.src = entryData.url;
                            previewContainer.style.display = 'block';
                            if (typeof currentEntryId !== 'undefined') {
                                currentEntryId = parseInt(entryId);
                            }
                            if (typeof updatePreviewDisplay === 'function') {
                                updatePreviewDisplay(entryData.system_type, entryData.url, entryData.title, entryData.prompt);
                            }
                        } else {
                            console.error(`Could not find data for entry ID: ${entryId}`);
                        }
                    }
                }
    
                if (event.target.classList.contains('close-preview-btn')) {
                    const entryId = event.target.dataset.entryId;
                    const entryDiv = event.target.closest('.entry-card');
                    if (entryDiv) {
                        const previewContainer = entryDiv.querySelector(`#preview-${entryId}`);
                        previewContainer.style.display = 'none';
                        if (typeof currentEntryId !== 'undefined' && currentEntryId === parseInt(entryId)) {
                            if (typeof clearPreviews === 'function') {
                                clearPreviews();
                            }
                        }
                    }
                }
    
                if (event.target.classList.contains('delete-btn')) {
                    const entryIdToDelete = event.target.dataset.entryId;
                    if (confirm(`Are you sure you want to delete entry ID: ${entryIdToDelete}?`)) {
                        try {
                            await deleteSiteEntry(entryIdToDelete);
                            loadExistingEntriesForPreviewPage(); // Reload entries after deletion
                            // Optionally, clear the preview if the deleted entry was being previewed
                            if (typeof currentEntryId !== 'undefined' && currentEntryId === parseInt(entryIdToDelete)) {
                                if (typeof clearPreviews === 'function') {
                                    clearPreviews();
                                }
                            }
                        } catch (error) {
                            console.error('Error deleting entry:', error);
                            alert('Error deleting entry.');
                        }
                    }
                }
            });
    
            // Load existing entries when the page loads
            loadExistingEntriesForPreviewPage();
        }
    });

    function clearPreviews() {
        updateMetadataPreview('manus', 'Not set', 'Not set', 'Not set');
        updateMetadataPreview('rabbitOS', 'Not set', 'Not set', 'Not set');
        manusIframePreview.src = 'about:blank';
        rabbitOSIframePreview.src = 'about:blank';
        manusPreviewContainer.innerHTML = '<p>manus preview will appear here</p>';
        rabbitOSPreviewContainer.innerHTML = '<p>rabbitOS preview will appear here</p>';
    }

    function updatePreviewDisplay(system, url, title, prompt) {
        updateMetadataPreview('manus', url, title, prompt);
        updateMetadataPreview('rabbitOS', url, title, prompt);

        if (system === 'manus' || system === 'both') {
            if (isValidUrl(url)) {
                manusIframePreview.src = url;
                manusPreviewContainer.innerHTML = '<p>Loading preview in iframe...</p>';
            } else {
                manusPreviewContainer.innerHTML = '<p>Invalid URL format.</p>';
                manusIframePreview.src = 'about:blank';
            }
        } else {
            manusIframePreview.src = 'about:blank';
            manusPreviewContainer.innerHTML = '<p>manus preview will appear here</p>';
        }

        if (system === 'rabbitOS' || system === 'both') {
            if (isValidUrl(url)) {
                rabbitOSIframePreview.src = url;
                rabbitOSPreviewContainer.innerHTML = '<p>Loading preview in iframe...</p>';
            } else {
                rabbitOSPreviewContainer.innerHTML = '<p>Invalid URL format.</p>';
                rabbitOSIframePreview.src = 'about:blank';
            }
        } else {
            rabbitOSIframePreview.src = 'about:blank';
            rabbitOSPreviewContainer.innerHTML = '<p>rabbitOS preview will appear here</p>';
        }
    }

    /**
     * Add event listener to the form submission (on the form page)
     */
    previewForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Get form values
        const system = systemSelect.value;
        const url = siteUrlInput.value.trim();
        const title = siteTitleInput.value.trim();
        const prompt = sitePromptInput.value.trim();

        // Store the data temporarily
        formData = {
            system,
            url,
            title,
            prompt
        };

        // Show loading notification
        showNotification('Saving entry...', 'info');

        try {
            // Save the entry to Supabase
            const { data, error } = await saveSiteEntry(formData);

            if (error) {
                console.error('Error saving entry:', error);
                showNotification('Error saving entry', 'error');
                return;
            }

            // Update the current entry ID
            if (data && data.length > 0) {
                currentEntryId = data[0].id;
            }

            showNotification('Entry saved successfully', 'success');

            // Optionally, switch to the previews page after saving
            showPage(previewsPage);
            // Reload existing entries on the preview page
            loadExistingEntriesForPreviewPage();

            // Clear the form
            previewForm.reset();
            // Reset the preview display (no direct manipulation of preview containers on form page anymore)

        } catch (error) {
            console.error('Error in form submission:', error);
            showNotification('Error saving entry', 'error');
        }
    });

    /**
     * Shows a notification to the user
     * @param {string} message - The message to display
     * @param {string} type - The type of notification (success, error, info)
     */
    function showNotification(message, type) {
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '1000';
            document.body.appendChild(notification);
        }

        if (type === 'success') {
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#F44336';
            notification.style.color = 'white';
        } else if (type === 'info') {
            notification.style.backgroundColor = '#2196F3';
            notification.style.color = 'white';
        }

        notification.textContent = message;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    /**
     * Validates the form inputs
     * @returns {boolean} Whether the form is valid
     */
    function validateForm() {
        if (!systemSelect.value) {
            showError(systemSelect, 'Please select a system');
            return false;
        }

        const url = siteUrlInput.value.trim();
        if (!url) {
            showError(siteUrlInput, 'Please enter a URL');
            return false;
        }

        if (!isValidUrl(url)) {
            showError(siteUrlInput, 'Please enter a valid URL (e.g., https://example.com)');
            return false;
        }

        return true;
    }

    /**
     * Shows error message for invalid form fields
     * @param {HTMLElement} element - The form element with error
     * @param {string} message - Error message to display
     */
    function showError(element, message) {
        let errorElement = element.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = 'var(--error-color)';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '-0.5rem';
            errorElement.style.marginBottom = '0.5rem';
            element.parentNode.insertBefore(errorElement, element.nextSibling);
        }

        errorElement.textContent = message;
        element.style.borderColor = 'var(--error-color)';

        setTimeout(() => {
            errorElement.textContent = '';
            element.style.borderColor = '';
        }, 3000);

        element.focus();
    }

    /**
     * Updates UI elements to show loading state (on the form page)
     * @param {string} system - Selected system (manus, rabbitOS, or both)
     */
    function updateUIForLoading(system) {
        // No direct loading indication on the form page anymore, notification is used
    }

    /**
     * Updates metadata display for a specific system on the preview page
     * @param {string} system - The system to update (manus or rabbitOS)
     * @param {string} url - The URL to display
     * @param {string} title - The title to display
     * @param {string} prompt - The prompt to display
     */
    function updateMetadataPreview(system, url, title, prompt) {
        if (system === 'manus') {
            manusUrlPreview.textContent = url || 'Not provided';
            manusTitlePreview.textContent = title || 'Not provided';
            manusPromptPreview.textContent = prompt || 'Not provided';
        } else if (system === 'rabbitOS') {
            rabbitOSUrlPreview.textContent = url || 'Not provided';
            rabbitOSTitlePreview.textContent = title || 'Not provided';
            rabbitOSPromptPreview.textContent = prompt || 'Not provided';
        }
    }

    /**
     * Checks if a string is a valid URL
     * @param {string} string - The string to check
     * @returns {boolean} Whether the string is a valid URL
     */
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Add event listeners to edit buttons on the preview page
    const previewEditButtons = document.querySelectorAll('.previews-page .edit-btn');
    previewEditButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const targetElement = document.getElementById(target);
            const currentValue = targetElement.textContent;

            const inputElement = document.createElement('input');
            inputElement.type = target.includes('url') ? 'url' : 'text';
            inputElement.value = currentValue === 'Not provided' ? '' : currentValue;
            inputElement.className = 'form-control form-control-sm';
            inputElement.style.width = '100%';

            const parentElement = targetElement.parentNode;
            parentElement.replaceChild(inputElement, targetElement);

            inputElement.focus();

            inputElement.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    saveEditedValuePreviewPage(inputElement, targetElement, target);
                }
            });

            inputElement.addEventListener('blur', function() {
                saveEditedValuePreviewPage(inputElement, targetElement, target);
            });

            button.style.display = 'none';
        });
    });

    /**
     * Saves the edited value from the preview page and updates the UI and database
     * @param {HTMLInputElement} inputElement - The input element with the new value
     * @param {HTMLElement} targetElement - The original element to restore
     * @param {string} target - The target identifier (e.g., 'manus-url-preview')
     */
    async function saveEditedValuePreviewPage(inputElement, targetElement, target) {
        const newValue = inputElement.value.trim();
        const parentElement = inputElement.parentNode;

        targetElement.textContent = newValue || 'Not provided';
        parentElement.replaceChild(targetElement, inputElement);

        const editButton = document.querySelector(`.previews-page [data-target="${target}"]`);
        editButton.style.display = '';

        const system = target.split('-')[0];
        const field = target.split('-')[1].replace('-preview', '');

        if (currentEntryId) {
            const updates = {};
            if (field === 'url') {
                updates.url = newValue;
            } else if (field === 'title') {
                updates.title = newValue;
            } else if (field === 'prompt') {
                updates.prompt = newValue;
            }

            try {
                const { error } = await updateSiteEntry(currentEntryId, updates);
                if (error) {
                    console.error('Error updating entry:', error);
                    showNotification('Error updating entry', 'error');
                } else {
                    showNotification('Entry updated successfully', 'success');
                    // Refresh the preview if the URL was updated
                    if (field === 'url' && isValidUrl(newValue)) {
                        const entry = await getSingleSiteEntry(currentEntryId);
                        if (entry) {
                            updatePreviewDisplay(entry.system_type, entry.url, entry.title, entry.prompt);
                        }
                    }
                }
            } catch (error) {
                console.error('Error in saveEditedValuePreviewPage:', error);
                showNotification('Error updating entry', 'error');
            }
        }
    }

    async function getSingleSiteEntry(id) {
        try {
            const { data, error } = await supabase
                .from('sites')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching single entry:', error);
                return null;
            }
            return data;
        } catch (error) {
            console.error('Error fetching single entry:', error);
            return null;
        }
    }

    // Initialize the UI to show the form page by default
    showPage(formPage);
});