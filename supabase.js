//main supabase.js in root of project

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://kxvlutmtepgxqvndnxbn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dmx1dG10ZXBneHF2bmRueGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTI0NTQsImV4cCI6MjA1ODQyODQ1NH0.BluTFwQdeTDmU1PsexgMtSs96yuv2kFEt1KDzssF7PA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log the current user's session
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);
});

// Database structure and available functions for website showcase application

/**
 * Websites Table Structure:
 * - id: UUID (primary key)
 * - created_at: timestamp
 * - updated_at: timestamp
 * - manus_url: string (website URL - manus means 'hand' in latin, referring to hand-submitted)
 * - title: string (website title)
 * - description: text (website description)
 * - category_id: UUID (foreign key to categories table)
 * - user_id: UUID (foreign key to users table)
 * - is_featured: boolean
 * - tags: array (tags associated with the website)
 * - screenshot_desktop: string (URL to desktop screenshot)
 * - screenshot_mobile: string (URL to mobile screenshot)
 * - screenshot_tablet: string (URL to tablet screenshot)
 */

/**
 * Categories Table Structure:
 * - id: UUID (primary key)
 * - created_at: timestamp
 * - name: string (category name)
 * - slug: string (URL-friendly category name)
 * - description: text (optional category description)
 */

/**
 * Users Table Structure:
 * - id: UUID (primary key)
 * - created_at: timestamp
 * - email: string (user email)
 * - name: string (user name)
 * - avatar_url: string (URL to user avatar)
 */

/**
 * Fetch all websites with pagination
 * @param {number} page - Page number
 * @param {number} pageSize - Number of items per page
 * @param {string} category - Optional category filter
 * @param {string} tag - Optional tag filter
 * @returns {Promise} - Promise resolving to websites data
 */
export async function getWebsites({ page = 1, pageSize = 10, category = null, tag = null }) {
  let query = supabase
    .from('websites')
    .select(`
      *,
      categories(name, slug)
    `)
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (category) {
    query = query.eq('categories.slug', category);
  }

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching websites:', error);
    throw error;
  }
  
  return data;
}

/**
 * Fetch a single website by ID
 * @param {string} id - Website ID
 * @returns {Promise} - Promise resolving to website data
 */
export async function getWebsiteById(id) {
  const { data, error } = await supabase
    .from('websites')
    .select(`
      *,
      categories(name, slug)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching website:', error);
    throw error;
  }
  
  return data;
}

/**
 * Add a new website
 * @param {Object} websiteData - Website data
 * @returns {Promise} - Promise resolving to the created website
 */
export async function addWebsite(websiteData) {
  // Ensure manus_url is included with fallback to null
  const completeData = {
    ...websiteData,
    manus_url: websiteData.manus_url || null
  };
  
  // First create the website entry
  const { data, error } = await supabase
    .from('websites')
    .insert([completeData])
    .select();
  
  if (error) {
    console.error('Error adding website:', error);
    console.error('Supabase error details:', error.message, error.details, error.hint, error.code);
    throw error;
  }
  
  const website = data[0];
  
  try {
    // Generate screenshots for the submitted URL
    const screenshotUrl = websiteData.manus_url || websiteData.intern_url;
    const screenshots = await generateScreenshots(screenshotUrl);
    
    // Update website with screenshot URLs
    const updateData = {
      screenshot_desktop: screenshots.desktop,
      screenshot_mobile: screenshots.mobile,
      screenshot_tablet: screenshots.tablet
    };
    
    const { data: updatedWebsite } = await supabase
      .from('websites')
      .update(updateData)
      .eq('id', website.id)
      .select()
      .single();
    
    return updatedWebsite;
  } catch (screenshotError) {
    console.error('Screenshot generation failed:', screenshotError);
    // Return original website data even if screenshots fail
    return website;
  }
}

/**
 * Update an existing website
 * @param {string} id - Website ID
 * @param {Object} websiteData - Updated website data
 * @returns {Promise} - Promise resolving to the updated website
 */
export async function updateWebsite(id, websiteData) {
  const { data, error } = await supabase
    .from('websites')
    .update(websiteData)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating website:', error);
    throw error;
  }
  
  return data[0];
}

/**
 * Delete a website
 * @param {string} id - Website ID
 * @returns {Promise} - Promise resolving to the deleted website
 */
export async function deleteWebsite(id) {
  const { data, error } = await supabase
    .from('websites')
    .delete()
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error deleting website:', error);
    throw error;
  }
  
  return data[0];
}

/**
 * Fetch all categories
 * @returns {Promise} - Promise resolving to categories data
 */
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
  
  return data;
}

/**
 * Generate screenshots for a website
 * @param {string} url - Website URL
 * @returns {Promise} - Promise resolving to screenshot URLs
 */
import { generateScreenshots } from './screenshot-service.js';
export { generateScreenshots };
