'use client';

import { useState, useEffect } from 'react';
import { entriesApi, subscribeToEntries } from '@/lib/supabase';

type Entry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  manus_url?: string;
  intern_url?: string;
};

export default function EntryList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await entriesApi.getAllEntries();
        setEntries(data);
      } catch (err) {
        setError('Failed to fetch entries');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();

    // Set up real-time subscription
    const subscription = subscribeToEntries((payload) => {
      if (payload.eventType === 'INSERT') {
        setEntries(prev => [payload.new as Entry, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setEntries(prev => 
          prev.map(entry => entry.id === payload.new.id ? payload.new as Entry : entry)
        );
      } else if (payload.eventType === 'DELETE') {
        setEntries(prev => 
          prev.filter(entry => entry.id !== payload.old.id)
        );
      }
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="text-center p-4">Loading entries...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (entries.length === 0) return <div className="text-center p-4">No entries found.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Entries</h2>
      {entries.map((entry) => (
        <div key={entry.id} className="border p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold">{entry.title}</h3>
          <p className="mt-2">{entry.content}</p>
          {entry.manus_url || entry.intern_url ? (
            <iframe 
              src={entry.manus_url || entry.intern_url} 
              className="preview-iframe mt-2 w-full h-64 rounded-lg"
              title="Website Preview"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLIFrameElement).style.display = 'none';
              }}
            />
          ) : null}
          <p className="text-sm text-gray-500 mt-2">
            Created: {new Date(entry.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
