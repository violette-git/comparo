/**
 * Accessibility Improvements for Website Showcase Application
 * This file adds ARIA attributes and keyboard navigation support
 */

document.addEventListener('DOMContentLoaded', function() {
  // Add ARIA attributes to improve accessibility
  addAriaAttributes();
  
  // Set up keyboard navigation
  setupKeyboardNavigation();
});

/**
 * Add ARIA attributes to elements for better screen reader support
 */
function addAriaAttributes() {
  // Add roles to major sections
  document.querySelector('header').setAttribute('role', 'banner');
  document.querySelector('main').setAttribute('role', 'main');
  document.querySelector('footer').setAttribute('role', 'contentinfo');
  
  // Add ARIA labels to form elements
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach(group => {
    const label = group.querySelector('label');
    const input = group.querySelector('input, textarea, select');
    const feedback = group.querySelector('.form-feedback');
    
    if (label && input) {
      // Connect label and input
      const inputId = input.id || `input-${Math.random().toString(36).substring(2, 9)}`;
      input.id = inputId;
      label.setAttribute('for', inputId);
      
      // Add ARIA attributes for validation
      input.setAttribute('aria-required', input.hasAttribute('required'));
      
      // Connect input with feedback element
      if (feedback) {
        const feedbackId = `feedback-${inputId}`;
        feedback.id = feedbackId;
        input.setAttribute('aria-describedby', feedbackId);
      }
    }
  });
  
  // Add ARIA attributes to buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    // Skip buttons that already have aria-label
    if (!button.hasAttribute('aria-label')) {
      // Use text content or add descriptive label
      if (button.textContent.trim()) {
        button.setAttribute('aria-label', button.textContent.trim());
      } else if (button.classList.contains('search-button')) {
        button.setAttribute('aria-label', 'Search');
      } else if (button.classList.contains('account-button')) {
        button.setAttribute('aria-label', 'User account');
      } else if (button.classList.contains('close-button')) {
        button.setAttribute('aria-label', 'Close');
      }
    }
    
    // Add pressed state for toggle buttons
    if (button.classList.contains('device-button') || 
        button.classList.contains('filter-tab') || 
        button.classList.contains('view-button')) {
      button.setAttribute('aria-pressed', button.classList.contains('active'));
    }
  });
  
  // Add ARIA attributes to website cards
  const websiteCards = document.querySelectorAll('.website-card');
  websiteCards.forEach((card, index) => {
    card.setAttribute('role', 'article');
    card.setAttribute('aria-labelledby', `card-title-${index}`);
    
    // Add ID to card title
    const cardTitle = card.querySelector('.card-title');
    if (cardTitle) {
      cardTitle.id = `card-title-${index}`;
    }
    
    // Make card actions accessible
    const cardActions = card.querySelectorAll('.card-actions button');
    cardActions.forEach(action => {
      if (!action.hasAttribute('aria-label')) {
        action.setAttribute('aria-label', `${action.textContent.trim()} ${cardTitle ? cardTitle.textContent : 'website'}`);
      }
    });
  });
  
  // Add ARIA attributes to modals
  const comparisonTemplate = document.getElementById('comparison-template');
  if (comparisonTemplate) {
    const modal = comparisonTemplate.content.querySelector('.comparison-modal');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'comparison-title');
    
    // Ensure the title has the right ID
    const modalTitle = modal.querySelector('.comparison-title');
    if (modalTitle) {
      modalTitle.id = 'comparison-title';
    }
  }
  
  // Add ARIA attributes to search
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.setAttribute('aria-label', 'Search websites');
  }
  
  // Add ARIA attributes to device switcher
  const deviceSwitchers = document.querySelectorAll('.device-switcher');
  deviceSwitchers.forEach((switcher, index) => {
    switcher.setAttribute('role', 'radiogroup');
    switcher.setAttribute('aria-label', 'Device size selection');
    
    // Set up radio button behavior for device buttons
    const deviceButtons = switcher.querySelectorAll('.device-button');
    deviceButtons.forEach(button => {
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', button.classList.contains('active'));
    });
  });
}

/**
 * Set up keyboard navigation for interactive elements
 */
function setupKeyboardNavigation() {
  // Add keyboard support for device switcher
  const deviceSwitchers = document.querySelectorAll('.device-switcher');
  deviceSwitchers.forEach(switcher => {
    switcher.addEventListener('keydown', function(event) {
      const buttons = Array.from(switcher.querySelectorAll('.device-button'));
      const currentIndex = buttons.findIndex(button => button === document.activeElement);
      
      if (currentIndex === -1) return;
      
      // Handle arrow keys
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % buttons.length;
        buttons[nextIndex].focus();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        buttons[prevIndex].focus();
      } else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        buttons[currentIndex].click();
      }
    });
  });
  
  // Add keyboard support for website cards
  const websiteCards = document.querySelectorAll('.website-card');
  websiteCards.forEach(card => {
    // Make cards focusable
    if (!card.hasAttribute('tabindex')) {
      card.setAttribute('tabindex', '0');
    }
    
    // Handle keyboard activation
    card.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        // Simulate click on view details button
        const viewButton = card.querySelector('.button');
        if (viewButton) {
          viewButton.click();
        }
      }
    });
  });
  
  // Add keyboard support for filter tabs
  const filterTabs = document.querySelector('.filter-tabs');
  if (filterTabs) {
    filterTabs.addEventListener('keydown', function(event) {
      const tabs = Array.from(filterTabs.querySelectorAll('.filter-tab'));
      const currentIndex = tabs.findIndex(tab => tab === document.activeElement);
      
      if (currentIndex === -1) return;
      
      // Handle arrow keys
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % tabs.length;
        tabs[nextIndex].focus();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        tabs[prevIndex].focus();
      } else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        tabs[currentIndex].click();
      }
    });
  }
  
  // Add keyboard support for comparison modal
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('compare-button')) {
      // When comparison modal opens, set focus trap
      setTimeout(() => {
        const modal = document.querySelector('.comparison-modal');
        if (modal) {
          setupFocusTrap(modal);
        }
      }, 100);
    }
  });
}

/**
 * Set up a focus trap for modal dialogs
 * @param {HTMLElement} modal - The modal element
 */
function setupFocusTrap(modal) {
  // Find all focusable elements
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // Set initial focus
  firstElement.focus();
  
  // Handle tab key to trap focus
  modal.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      // Close modal on Escape
      const closeButton = modal.querySelector('.close-button');
      if (closeButton) {
        closeButton.click();
      }
    } else if (event.key === 'Tab') {
      // Trap focus within modal
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });
}

// Export functions for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addAriaAttributes,
    setupKeyboardNavigation
  };
}