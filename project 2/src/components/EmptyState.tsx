import React from 'react';
import { Search } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6">
          <Search className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">No account selected</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Search for a company above to generate comprehensive account intelligence
        </p>
        <div className="mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Try searching for companies like "Acme Corp", "TechSolutions", or "Global Industries"
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;