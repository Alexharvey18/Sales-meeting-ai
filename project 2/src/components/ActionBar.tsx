import React, { useState } from 'react';
import { Download, Share2, FileEdit } from 'lucide-react';
import { useAccount } from '../contexts/AccountContext';

interface ActionBarProps {
  activeTab: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ activeTab }) => {
  const { account } = useAccount();
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  if (!account) return null;

  const handleExport = () => {
    alert(`Exporting ${activeTab} data for ${account.name}. In a real app, this would generate a PDF.`);
  };

  const handleRefine = () => {
    alert(`Refining data for ${account.name}. In a real app, this would allow you to adjust the AI output.`);
  };

  const handleShare = (method: string) => {
    alert(`Sharing via ${method} for ${account.name}. In a real app, this would open a sharing dialog.`);
    setShowShareOptions(false);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-3 px-4 md:px-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {account.name}
          {account.industry && <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">({account.industry})</span>}
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={handleRefine}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <FileEdit className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Refine</span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Share2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Share</span>
            </button>
            
            {showShareOptions && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10 animate-fadeIn">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => handleShare('Email')}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                  >
                    Email
                  </button>
                  <button
                    onClick={() => handleShare('Slack')}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                  >
                    Slack
                  </button>
                  <button
                    onClick={() => handleShare('Salesforce')}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                  >
                    Salesforce
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleExport}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;