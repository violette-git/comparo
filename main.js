// Import Supabase client and API functions
import { supabase, getCategories, getWebsites, addWebsite, generateScreenshots } from './supabase.js';

// DOM Elements
const websiteForm = document.getElementById('website-form');
const websiteGrid = document.querySelector('.website-grid');
const filterTabs = document.querySelector('.filter-tabs');
const categorySelect = document.getElementById('category');
const loadMoreButton = document.getElementById('load-more');
const deviceButtons = document.querySelectorAll('.device-button');
const websiteCardTemplate = document.getElementById('website-card-template');
const featuredPreviewImage = document.querySelector('.featured-preview .preview-image');

// State Management
const state = {
 categories: [],
 currentPage: 1,
 pageSize: 8,
 currentCategory: 'all',
 currentDevice: 'desktop',
 isLoading: false,
 hasMoreWebsites: true
};

function updateLoadingState(isLoading) {
 const loader = document.querySelector('.global-loader');
 if (loader) {
  loader.style.display = isLoading ? 'flex' : 'none';
 }
 loadMoreButton.disabled = isLoading;
}

function showErrorMessage(message) {
 const errorContainer = document.getElementById('error-container');
 if (errorContainer) {
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
  setTimeout(() => {
   errorContainer.style.display = 'none';
  }, 5000);
 }
 console.error(message);
}

async function initApp() {
 try {
  await loadCategories();
  await loadAndRenderWebsites(true);
  setupEventListeners();
  loadFeaturedWebsite();
  console.log('Application initialized successfully');
 } catch (error) {
  console.error('Error initializing application:', error);
  showErrorMessage('Failed to initialize application. Please try again later.');
 }
}

async function loadCategories() {
 console.log('Starting loadCategories...');
 try {
  const categories = await getCategories();
  state.categories = categories && Array.isArray(categories) ? categories : [];
  renderCategoryOptions();
  renderFilterTabs();
 } catch (error) {
  console.error('Error loading categories:', error);
  showErrorMessage('Failed to load categories.');
 }
}

function renderCategoryOptions() {
 if (!categorySelect) return;
 categorySelect.innerHTML = '<option value="">Select a category</option>';
 state.categories.forEach(category => {
  const option = document.createElement('option');
  option.value = category.id;
  option.textContent = category.name;
  categorySelect.appendChild(option);
 });
}

function renderFilterTabs() {
 const existingTabs = filterTabs.querySelectorAll('.filter-tab:not([data-category="all"])');
 existingTabs.forEach(tab => tab.remove());
 state.categories.forEach(category => {
  const button = document.createElement('button');
  button.classList.add('filter-tab');
  button.dataset.category = category.slug;
  button.textContent = category.name;
  filterTabs.appendChild(button);
 });
}

async function loadAndRenderWebsites(reset = false) {
 if (state.isLoading) return;
 state.isLoading = true;
 updateLoadingState(true);

 if (reset) {
  state.currentPage = 1;
  websiteGrid.innerHTML = '';
  state.hasMoreWebsites = true;
 }

 try {
  const websites = await getWebsites({
   page: state.currentPage,
   pageSize: state.pageSize,
   category: state.currentCategory !== 'all' ? state.currentCategory : null
  });

  if (websites && websites.length > 0) {
   renderWebsites(websites);
   state.hasMoreWebsites = websites.length === state.pageSize;
  } else {
   state.hasMoreWebsites = false;
   if (state.currentPage === 1) {
    websiteGrid.innerHTML = '<p>No websites found matching your criteria.</p>';
   }
  }
 } catch (error) {
  console.error('Error loading websites:', error);
  showErrorMessage('Failed to load websites. Please try again later.');
  state.hasMoreWebsites = false;
 } finally {
  state.isLoading = false;
  updateLoadingState(false);
 }
}

function renderWebsites(websites) {
 console.log('Rendering batch of websites:', websites.length);
 const fragment = document.createDocumentFragment();

 websites.forEach(website => {
  if (!websiteCardTemplate) return;
  const card = websiteCardTemplate.content.cloneNode(true);
  const cardElement = card.querySelector('.website-card');

  // Populate Card
  const titleEl = card.querySelector('.card-title');
  const previewImgEl = card.querySelector('.preview-image');
  const categoryEl = card.querySelector('.card-category');
  const tagsContainer = card.querySelector('.card-tags');
  const viewDetailsButton = card.querySelector('.button');

  if (titleEl) titleEl.textContent = website.title || 'No Title';
  if (categoryEl) categoryEl.textContent = website.categories?.name || 'Uncategorized';

  // Updated URL handling with prioritized validation
        const previewIframe = card.querySelector('.preview-iframe');
        const urlStatusBadge = card.querySelector('.url-source-badge');
        
        if (previewIframe) {
            // Add loading state
            previewIframe.onload = () => {
                previewIframe.classList.remove('loading');
            };
            previewIframe.classList.add('loading');
   if (previewIframe) {
    let finalUrl = 'about:blank';
    let urlStatus = '';

    // Validate manus_url first
    if (website.manus_url) {
     try {
      const manusUrl = new URL(
       website.manus_url.includes('://')
        ? website.manus_url
        : `https://${website.manus_url}`
      );
      finalUrl = manusUrl.href;
      urlStatus = 'manus_url';
     } catch (error) {
      console.error(`Invalid manus_url for ${website.title}: ${website.manus_url}`, error);
     }
    }

    // Fallback to intern_url
    if (!urlStatus && website.intern_url) {
     try {
      const internUrl = new URL(
       website.intern_url.includes('://')
        ? website.intern_url
        : `https://${website.intern_url}`
      );
      finalUrl = internUrl.href;
      urlStatus = 'intern_url';
     } catch (error) {
      console.error(`Invalid intern_url for ${website.title}: ${website.intern_url}`, error);
     }
    }

    // Set the iframe src with fallback to error page
    const titleBase = website.title ? `${website.title} Preview` : 'Website Preview';
    previewIframe.src = finalUrl !== 'about:blank' 
      ? finalUrl
      : '/assets/invalid-url-placeholder.html';
    previewIframe.title = finalUrl !== 'about:blank'
      ? `${titleBase}${urlStatus ? ` (using ${urlStatus})` : ''}`
      : `${titleBase} - Invalid URL`;
   }
  }

  // Tags handling
  if (tagsContainer && website.tags?.length) {
   tagsContainer.innerHTML = '';
   website.tags.forEach(tag => {
    const tagSpan = document.createElement('span');
    tagSpan.classList.add('tag');
    tagSpan.textContent = tag;
    tagsContainer.appendChild(tagSpan);
   });
  }

  if (viewDetailsButton) {
   viewDetailsButton.dataset.websiteId = website.id;
  }

  fragment.appendChild(card);
 });

 websiteGrid.appendChild(fragment);
}

async function handleFormSubmit(event) {
 event.preventDefault();
 const title = document.getElementById('title').value;
 const manus_url = document.getElementById('manus_url').value;
 const intern_url = document.getElementById('intern_url').value;
 const categoryId = categorySelect.value;
 const tagsInput = document.getElementById('tags').value;
 const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

 if (!title || !categoryId) {
  showErrorMessage('Title and Category are required.');
  return;
 }

 updateLoadingState(true);
 try {
  const newWebsite = await addWebsite({
   title,
   manus_url,
   intern_url,
   category_id: categoryId,
   tags
  });
  if (newWebsite) {
   showSuccessMessage('Website added successfully!');
   websiteForm.reset();
   await loadAndRenderWebsites(true); // Reload websites to show the new one
  } else {
   showErrorMessage('Failed to add website.');
  }
 } catch (error) {
  console.error('Error adding website:', error);
  showErrorMessage('Failed to add website. Please try again.');
 } finally {
  updateLoadingState(false);
 }
}

function showSuccessMessage(message) {
 const successContainer = document.getElementById('success-container');
 if (successContainer) {
  successContainer.textContent = message;
  successContainer.style.display = 'block';
  setTimeout(() => {
   successContainer.style.display = 'none';
  }, 3000);
 } else {
  alert(message); // Fallback if the container doesn't exist
 }
}

function handleFilterTabClick(event) {
 if (event.target.classList.contains('filter-tab')) {
  const categorySlug = event.target.dataset.category;
  state.currentCategory = categorySlug;
  loadAndRenderWebsites(true);
  // Update active state of tabs (optional)
  document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');
 }
}

async function handleLoadMore() {
 if (state.hasMoreWebsites && !state.isLoading) {
  state.currentPage++;
  await loadAndRenderWebsites();
 }
}

function setupEventListeners() {
 if (websiteForm) {
  websiteForm.addEventListener('submit', handleFormSubmit);
 }
 if (filterTabs) {
  filterTabs.addEventListener('click', handleFilterTabClick);
 }
 if (loadMoreButton) {
  loadMoreButton.addEventListener('click', handleLoadMore);
 }
 deviceButtons.forEach(button => {
  button.addEventListener('click', () => {
   deviceButtons.forEach(btn => btn.classList.remove('active'));
   button.classList.add('active');
   state.currentDevice = button.dataset.device;
   // Potentially trigger a re-render or update styles based on the device
   console.log(`Device set to: ${state.currentDevice}`);
   // You might want to reload the featured website or adjust the preview iframe here
   loadFeaturedWebsite(); // Reload featured website to reflect device change
  });
 });
}

async function loadFeaturedWebsite() {
 try {
  const websites = await getWebsites({ pageSize: 1, featured: true });
  if (websites && websites.length > 0) {
   const featuredWebsite = websites[0];
   let featuredUrl = 'about:blank';

   if (featuredWebsite.manus_url) {
    try {
     featuredUrl = new URL(
      featuredWebsite.manus_url.includes('://')
       ? featuredWebsite.manus_url
       : `https://${featuredWebsite.manus_url}`
     ).href;
    } catch (error) {
     console.error('Invalid featured manus_url:', featuredWebsite.manus_url);
    }
   } else if (featuredWebsite.intern_url) {
    try {
     featuredUrl = new URL(
      featuredWebsite.intern_url.includes('://')
       ? featuredWebsite.intern_url
       : `https://${featuredWebsite.intern_url}`
     ).href;
    } catch (error) {
     console.error('Invalid featured intern_url:', featuredWebsite.intern_url);
    }
   }

   if (featuredPreviewImage) {
    // For simplicity, we might just change the src of an existing iframe or image
    // If you have a specific featured preview iframe, target that instead.
    const featuredIframe = document.querySelector('.featured-preview iframe');
    if (featuredIframe) {
     featuredIframe.src = featuredUrl;
     featuredIframe.title = featuredWebsite.title || 'Featured Website';
    } else {
     featuredPreviewImage.src = featuredUrl; // Fallback if no iframe
     featuredPreviewImage.alt = featuredWebsite.title || 'Featured Website';
    }
   }
  } else {
   console.log('No featured website found.');
   if (featuredPreviewImage) {
    featuredPreviewImage.src = 'placeholder-image.png'; // Or some default
    featuredPreviewImage.alt = 'No featured website';
   }
  }
 } catch (error) {
  console.error('Error loading featured website:', error);
 }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', initApp);

// Toggle collapsible section
window.toggleCollapsible = function(elementId) {
  console.log('Toggling collapsible section:', elementId);
  const collapsibleContent = document.getElementById(elementId);
  if (collapsibleContent) {
    if (collapsibleContent.style.display === 'none' || collapsibleContent.style.display === '') {
      collapsibleContent.style.display = 'block';
    } else {
      collapsibleContent.style.display = 'none';
    }
  }
};