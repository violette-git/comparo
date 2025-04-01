import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// These environment variables should be set in your project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// CRUD operations for website entries
export const entriesApi = {
  // Create a new entry
  async createEntry(entryData: any) {
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
      .select('*, manus_url, intern_url')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Read a single entry by ID
  async getEntryById(id: string) {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update an entry
  async updateEntry(id: string, updates: any) {
    const { data, error } = await supabase
      .from('entries')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  },
  
  // Delete an entry
  async deleteEntry(id: string) {
    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Real-time subscription to entries changes
export const subscribeToEntries = (callback: (payload: any) => void) => {
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
