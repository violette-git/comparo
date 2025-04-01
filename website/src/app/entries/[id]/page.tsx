'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { entriesApi } from '@/lib/supabase';

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setIsDeleting(true);
      try {
        await entriesApi.deleteEntry(id);
        router.push('/entries');
      } catch (err) {
        console.error('Error deleting entry:', err);
        setError('Failed to delete entry');
        setIsDeleting(false);
      }
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading entry...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  if (!entry) return <div className="container mx-auto px-4 py-8">Entry not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/entries" className="text-blue-500 hover:underline">
          &larr; Back to Entries
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{entry.title}</h1>
        <p className="text-gray-700 mb-6 whitespace-pre-wrap">{entry.content}</p>
        
        <div className="text-sm text-gray-500 mb-6">
          Created: {new Date(entry.created_at).toLocaleString()}
        </div>
        
        <div className="flex space-x-4">
          <Link 
            href={`/entries/${id}/edit`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}