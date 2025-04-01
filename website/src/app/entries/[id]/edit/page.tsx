'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EntryForm from '@/components/EntryForm';
import { entriesApi } from '@/lib/supabase';

export default function EditEntryPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const data = await entriesApi.getEntryById(id);
        setEntry(data);
      } catch (err) {
        console.error('Error fetching entry:', err);
        setError('Failed to load entry');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading entry...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  if (!entry) return <div className="container mx-auto px-4 py-8">Entry not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Entry</h1>
      <EntryForm entry={entry} isEditing={true} />
    </div>
  );
}