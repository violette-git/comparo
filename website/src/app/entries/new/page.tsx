import EntryForm from '@/components/EntryForm';

export default function NewEntryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Entry</h1>
      <EntryForm />
    </div>
  );
}