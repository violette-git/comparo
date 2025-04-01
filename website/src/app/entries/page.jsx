import EntryList from '@/components/EntryList';
import Link from 'next/link';
import React, { useState } from 'react';

export default function EntriesPage() {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Website Entries</h1>
        <button 
          onClick={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isCollapsibleOpen ? 'Hide Add New Entry' : 'Add New Entry'}
        </button>
      </div>
      
      {isCollapsibleOpen && (
        <div>
          <Link 
            href="/entries/new" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-6"
          >
            Add New Entry
          </Link>
        </div>
      )}
      
      <EntryList />
      
      <div className="mt-8">
        <Link 
          href="/" 
          className="text-blue-500 hover:underline"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
