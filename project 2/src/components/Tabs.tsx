import React from 'react';
import { FileText, Users, Phone, PieChart } from 'lucide-react';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Account Overview', icon: <FileText className="w-5 h-5" /> },
    { id: 'prospecting', label: 'Prospecting Strategy', icon: <Users className="w-5 h-5" /> },
    { id: 'discovery', label: 'Discovery Call', icon: <Phone className="w-5 h-5" /> },
    { id: 'value', label: 'Value Proposition', icon: <PieChart className="w-5 h-5" /> },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto">
        <nav className="flex overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative min-w-0 flex-1 overflow-hidden py-4 px-4 md:px-6 text-sm md:text-base font-medium text-center focus:outline-none
                ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }
                transition-colors duration-200
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <div className="flex items-center justify-center space-x-2">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Tabs;