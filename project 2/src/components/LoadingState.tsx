import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Generating Intelligence</h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        Analyzing company information and preparing comprehensive insights. This may take a moment...
      </p>
    </div>
  );
};

export default LoadingState;