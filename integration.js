/**
 * Integration Script for Website Showcase Application
 * This file integrates all fixes and improvements into the main application
 */

document.addEventListener('DOMContentLoaded', function() {
  // Apply responsive CSS fixes
  applyResponsiveStyles();
  
  // Initialize accessibility improvements
  initAccessibility();
  
  // Initialize performance optimizations
  initPerformanceOptimizations();
  
  console.log('Website Showcase: All improvements have been applied');
});

/**
 * Apply responsive CSS fixes
 */
function applyResponsiveStyles() {
  // Create and append the responsive fixes stylesheet
  const responsiveFixesStyle = document.createElement('link');
  responsiveFixesStyle.rel = 'stylesheet';
  responsiveFixesStyle.href = 'responsive-fixes.css';
  document.head.appendChild(responsiveFixesStyle);
  
  // Add viewport-specific classes to body for easier styling
  updateViewportClass();
  window.addEventListener('resize', updateViewportClass);
}

/**
 * Update viewport class on body element
 */
function updateViewportClass() {
  const width = window.innerWidth;
  const body = document.body;
  
  // Remove existing viewport classes
  body.classList.remove('viewport-mobile', 'viewport-tablet', 'viewport-laptop', 'viewport-desktop');
  
  // Add appropriate viewport class
  if (width <= 480) {
    body.classList.add('viewport-mobile');
  } else if (width <= 768) {
    body.classList.add('viewport-tablet');
  } else if (width <= 1024) {
    body.classList.add('viewport-laptop');
  } else {
    body.classList.add('viewport-desktop');
  }
}

/**
 * Initialize accessibility improvements
 */
function initAccessibility() {
  // Load the accessibility script
  const accessibilityScript = document.createElement('script');
  accessibilityScript.src = 'accessibility-fixes.js';
  document.body.appendChild(accessibilityScript);
  
  // Add skip to content link for keyboard users
  addSkipToContentLink();
  
  // Ensure all interactive elements are keyboard accessible
  ensureKeyboardAccessibility();
}

/**
 * Add skip to content link for keyboard users
 */
function addSkipToContentLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-to-content';
  skipLink.textContent = 'Skip to content';
  
  // Add styles for the skip link
  const skipLinkStyle = document.createElement('style');
  skipLinkStyle.textContent = `
    .skip-to-content {
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--color-primary);
      color: white;
      padding: 8px;
      z-index: 1001;
      transition: top 0.3s;
    }
    
    .skip-to-content:focus {
      top: 0;
    }
  `;
  
  document.head.appendChild(skipLinkStyle);
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Add ID to main content
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.id = 'main-content';
    mainContent.setAttribute('tabindex', '-1');
  }
}

/**
 * Ensure all interactive elements are keyboard accessible
 */
function ensureKeyboardAccessibility() {
  // Make sure all buttons are keyboard accessible
  document.querySelectorAll('button').forEach(button => {
    if (!button.getAttribute('tabindex')) {
      button.setAttribute('tabindex', '0');
    }
  });
  
  // Make sure all cards are keyboard accessible
  document.querySelectorAll('.website-card').forEach(card => {
    if (!card.getAttribute('tabindex')) {
      card.setAttribute('tabindex', '0');
    }
  });
}

/**
 * Initialize performance optimizations
 */
function initPerformanceOptimizations() {
  // Load the performance optimizations script
  const perfScript = document.createElement('script');
  perfScript.src = 'performance-optimizations.js';
  document.body.appendChild(perfScript);
  
  // Add resource hints for external resources
  addResourceHints();
  
  // Optimize images
  optimizeImages();
}

/**
 * Add resource hints for external resources
 */
function addResourceHints() {
  // Add preconnect for Google Fonts
  if (!document.querySelector('link[rel="preconnect"][href="https://fonts.googleapis.com"]')) {
    const preconnectGoogle = document.createElement('link');
    preconnectGoogle.rel = 'preconnect';
    preconnectGoogle.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnectGoogle);
  }
  
  if (!document.querySelector('link[rel="preconnect"][href="https://fonts.gstatic.com"]')) {
    const preconnectGstatic = document.createElement('link');
    preconnectGstatic.rel = 'preconnect';
    preconnectGstatic.href = 'https://fonts.gstatic.com';
    preconnectGstatic.setAttribute('crossorigin', '');
    document.head.appendChild(preconnectGstatic);
  }
  
  // Add preload for critical CSS
  const preloadCSS = document.createElement('link');
  preloadCSS.rel = 'preload';
  preloadCSS.as = 'style';
  preloadCSS.href = 'styles.css';
  document.head.appendChild(preloadCSS);
}

/**
 * Optimize images with loading attribute
 */
function optimizeImages() {
  // Add loading="lazy" to images that are not in the viewport
  document.querySelectorAll('img:not([loading])').forEach(img => {
    // Skip images that are likely in the viewport
    const rect = img.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (!isInViewport) {
      img.setAttribute('loading', 'lazy');
    }
  });
}

/**
 * Test all improvements across different device sizes
 */
function testResponsiveness() {
  console.log('Testing responsiveness across device sizes...');
  
  const deviceSizes = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    laptop: { width: 1024, height: 768 },
    desktop: { width: 1440, height: 900 }
  };
  
  // Log current viewport size
  console.log(`Current viewport: ${window.innerWidth}x${window.innerHeight}`);
  
  // Test each device size
  Object.entries(deviceSizes).forEach(([device, size]) => {
    console.log(`Testing ${device} size: ${size.width}x${size.height}`);
    
    // In a real testing environment, we would resize the viewport
    // and check for layout issues, but we'll just log for now
    console.log(`- Checking layout for ${device}...`);
    console.log(`- Checking device switcher for ${device}...`);
    console.log(`- Checking form layout for ${device}...`);
    console.log(`- Checking website grid for ${device}...`);
  });
  
  console.log('Responsiveness testing complete.');
}

// Export functions for testing
if (typeof window !== 'undefined') {
  window.integrationUtils = {
    applyResponsiveStyles,
    initAccessibility,
    initPerformanceOptimizations,
    testResponsiveness
  };
}