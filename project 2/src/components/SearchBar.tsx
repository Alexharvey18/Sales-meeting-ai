import React, { useState } from 'react';
import { Search, Filter, X, Link as LinkIcon } from 'lucide-react';
import { useAccount } from '../contexts/AccountContext';

const SearchBar: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    filters, 
    setFilters, 
    searchAccount, 
    searchHistory,
    isLoading
  } = useAccount();
  
  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Basic URL validation
    if (urlInput && !isValidUrl(urlInput)) {
      alert('Please enter a valid URL');
      return;
    }
    
    searchAccount(searchQuery, urlInput);
    setShowHistory(false);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    searchAccount(query, '');
    setShowHistory(false);
  };

  const toggleUrlInput = () => {
    setShowUrlInput(!showUrlInput);
    if (showUrlInput) {
      setUrlInput('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-effect rounded-xl card-shadow p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            className="block w-full pl-10 pr-32 py-3 border border-gray-200/50 dark:border-gray-700/50 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter company name..."
          />
          
          <button
            type="button"
            onClick={toggleUrlInput}
            className="absolute right-24 inset-y-0 flex items-center px-3 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <LinkIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-16 inset-y-0 flex items-center px-3 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Filter className="h-5 w-5" />
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`absolute right-2 inset-y-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>

        {showUrlInput && (
          <div className="animate-fadeIn">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-200/50 dark:border-gray-700/50 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter company URL or LinkedIn profile..."
            />
          </div>
        )}

        {showHistory && searchHistory.length > 0 && (
          <div className="absolute z-10 mt-1 w-full max-w-4xl glass-effect rounded-lg card-shadow border border-gray-200/50 dark:border-gray-700/50">
            <ul className="py-1">
              {searchHistory.map((item, index) => (
                <li 
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 cursor-pointer text-gray-700 dark:text-gray-200 transition-colors duration-200"
                  onClick={() => handleHistoryClick(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg animate-fadeIn">
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Industry
              </label>
              <select
                id="industry"
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                className="block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Size
              </label>
              <select
                id="size"
                value={filters.size}
                onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                className="block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Sizes</option>
                <option value="Small">Small (1-100)</option>
                <option value="Medium">Medium (101-1000)</option>
                <option value="Enterprise">Enterprise (1000+)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <select
                id="location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Locations</option>
                <option value="United States">United States</option>
                <option value="Europe">Europe</option>
                <option value="Asia Pacific">Asia Pacific</option>
                <option value="Latin America">Latin America</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setFilters({ industry: '', size: '', location: '' });
                setShowFilters(false);
              }}
              className="md:col-start-3 md:justify-self-end flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;