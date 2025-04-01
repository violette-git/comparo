'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { entriesApi } from '@/lib/supabase';

type EntryFormProps = {
  entry?: {
    id: string;
    title: string;
    content: string;
    manus_url?: string;
    intern_url?: string;
  };
  isEditing?: boolean;
};

export default function EntryForm({ entry, isEditing = false }: EntryFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [manusUrl, setmanusUrl] = useState(entry?.manus_url || '');
  const [internUrl, setinternUrl] = useState(entry?.intern_url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing && entry) {
        await entriesApi.updateEntry(entry.id, { 
          title, 
          content,
          manus_url: manusUrl,
          intern_url: internUrl
        });
      } else {
        await entriesApi.createEntry({ 
          title, 
          content,
          manus_url: manusUrl,
          intern_url: internUrl
        });
      }
      router.push('/entries');
      router.refresh();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to save entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="manus_url" className="block text-sm font-medium text-gray-700">
          manuscript URL
        </label>
        <input
          type="url"
          id="manus_url"
          value={manusUrl}
          onChange={(e) => setmanusUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label htmlFor="intern_url" className="block text-sm font-medium text-gray-700">
          internal URL
        </label>
        <input
          type="url"
          id="intern_url"
          value={internUrl}
          onChange={(e) => setinternUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://internal.example.com"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="mr-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Entry' : 'Create Entry'}
        </button>
      </div>
    </form>
  );
}
