//website/supabase.js 

// import { createClient } from '../@supabase/supabase-js';

// Initialize the Supabase client
// These environment variables should be set in your project
const supabaseUrl = 'https://kxvlutmtepgxqvndnxbn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4dmx1dG10ZXBneHF2bmRueGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTI0NTQsImV4cCI6MjA1ODQyODQ1NH0.BluTFwQdeTDmU1PsexgMtSs96yuv2kFEt1KDzssF7PA';

// Create a single supabase client for interacting with your database
export const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey)

// CRUD operations for website entries
export const entriesApi = {
  // Create a new entry
  async createEntry(entryData) {
    const { data, error } = await supabase
      .from('entries')
      .insert([entryData])
      .select();
    
    if (error) throw error;
    return data;
  },
  
  // Read all entries
  async getAllEntries() {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Read a single entry by ID
  async getEntryById(id) {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update an entry
  async updateEntry(id, updates) {
    const { data, error } = await supabase
      .from('entries')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  },
  
  // Delete an entry
  async deleteEntry(id) {
    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Real-time subscription to entries changes
export const subscribeToEntries = (callback) => {
  return supabase
    .channel('entries-channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'entries' }, 
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
};