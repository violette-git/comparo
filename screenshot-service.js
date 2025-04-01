/**
 * Screenshot Service
 * Handles website screenshot generation using ScrapFly API
 */

// ScrapFly API configuration
const SCRAPFLY_API_KEY = 'scp-live-06fbba3c15944e319386446c7544bd5a';
const SCRAPFLY_API_URL = 'https://api.scrapfly.io/scrape';

/**
 * Generate screenshots for a website at different device sizes
 * @param {string} url - The URL of the website to screenshot
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} - Object containing screenshot URLs for different devices
 */
export async function generateScreenshots(url, options = {}) {
  try {
    // Default options
    const defaultOptions = {
      devices: ['desktop', 'tablet', 'mobile'],
      waitForSelector: 'body',
      timeout: 30000, // 30 seconds
      fullPage: true,
      quality: 80, // JPEG quality (0-100)
      format: 'jpeg',
    };

    // Merge default options with provided options
    const config = { ...defaultOptions, ...options };
    
    // Device viewport configurations
    const deviceViewports = {
      desktop: { width: 1920, height: 1080 },
      tablet: { width: 1024, height: 768 },
      mobile: { width: 375, height: 667 }
    };

    // Generate screenshots for each device in parallel
    const screenshotPromises = config.devices.map(device => 
      generateScreenshotForDevice(url, device, deviceViewports[device], config)
    );

    // Wait for all screenshots to be generated
    const screenshots = await Promise.all(screenshotPromises);

    // Create result object with device-specific URLs
    const result = {};
    config.devices.forEach((device, index) => {
      result[device] = screenshots[index];
    });

    return result;
  } catch (error) {
    console.error('Error generating screenshots:', error);
    throw new Error(`Failed to generate screenshots: ${error.message}`);
  }
}

/**
 * Generate a screenshot for a specific device
 * @param {string} url - The URL of the website to screenshot
 * @param {string} deviceName - The name of the device (desktop, tablet, mobile)
 * @param {Object} viewport - The viewport dimensions
 * @param {Object} config - Screenshot configuration
 * @returns {Promise<string>} - URL of the generated screenshot
 */
async function generateScreenshotForDevice(url, deviceName, viewport, config) {
  try {
    // Prepare request payload for ScrapFly API
    const payload = {
      key: SCRAPFLY_API_KEY,
      url: url,
      render_js: true,
      screenshot: true,
      screenshot_options: {
        full_page: config.fullPage,
        format: config.format,
        quality: config.quality,
        viewport: viewport
      },
      wait_for: {
        selector: config.waitForSelector,
        timeout_ms: config.timeout
      }
    };

    // Make API request to ScrapFly
    const response = await fetch(SCRAPFLY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SCRAPFLY_API_KEY
      },
      mode: 'cors',
      body: JSON.stringify(payload)
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`ScrapFly API error: ${errorData.message || response.statusText}`);
    }

    // Parse the response
    const data = await response.json();
    
    // Return the screenshot URL or data
    if (data.result && data.result.screenshot) {
      // For this implementation, we're assuming ScrapFly returns a URL to the screenshot
      // In a real implementation, you might need to handle base64 data or other formats
      return data.result.screenshot;
    } else {
      throw new Error('Screenshot not found in API response');
    }
  } catch (error) {
    console.error(`Error generating ${deviceName} screenshot:`, error);
    // Return a fallback image URL for the specific device
    return `/images/fallback-${deviceName}.jpg`;
  }
}

/**
 * Check if a URL is valid
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get a placeholder screenshot URL for testing
 * @param {string} url - The website URL
 * @param {string} device - The device type
 * @returns {string} - Placeholder screenshot URL
 */
export function getPlaceholderScreenshot(url, device = 'desktop') {
  // This is a fallback for development/testing
  const encodedUrl = encodeURIComponent(url);
  const dimensions = {
    desktop: '1920x1080',
    tablet: '1024x768',
    mobile: '375x667'
  };
  
  return `https://api.screenshotmachine.com?key=placeholder-key&url=${encodedUrl}&dimension=${dimensions[device]}`;
}
