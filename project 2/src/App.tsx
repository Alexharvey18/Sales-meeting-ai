import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { AccountProvider } from './contexts/AccountContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Tabs from './components/Tabs';
import ActionBar from './components/ActionBar';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';
import AccountOverview from './pages/AccountOverview';
import ProspectingStrategy from './pages/ProspectingStrategy';
import DiscoveryCall from './pages/DiscoveryCall';
import ValueProposition from './pages/ValueProposition';
import { useAccount } from './contexts/AccountContext';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { account, accountIntelligence, isLoading } = useAccount();

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (!account || !accountIntelligence) {
      return <EmptyState />;
    }

    return (
      <div className="flex flex-col h-full">
        <ActionBar activeTab={activeTab} />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && <AccountOverview />}
          {activeTab === 'prospecting' && <ProspectingStrategy />}
          {activeTab === 'discovery' && <DiscoveryCall />}
          {activeTab === 'value' && <ValueProposition />}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {renderContent()}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AccountProvider>
          <div className="flex flex-col h-screen text-gray-900 dark:text-white">
            <Header />
            <main className="flex-1 flex flex-col overflow-hidden">
              <div className="py-6 px-4">
                <SearchBar />
              </div>
              <MainContent />
            </main>
            <Toaster position="top-right" theme="system" />
          </div>
        </AccountProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;