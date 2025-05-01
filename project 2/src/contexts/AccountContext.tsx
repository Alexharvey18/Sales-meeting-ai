import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { Account, AccountIntelligence } from '../types';
import { analyzeCompany, generateIntelligence } from '../services/ai';

interface AccountContextType {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filters: {
    industry: string;
    size: string;
    location: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    industry: string;
    size: string;
    location: string;
  }>>;
  isLoading: boolean;
  account: Account | null;
  accountIntelligence: AccountIntelligence | null;
  searchHistory: string[];
  searchAccount: (query: string, url?: string) => Promise<void>;
  clearAccount: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    industry: '',
    size: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [accountIntelligence, setAccountIntelligence] = useState<AccountIntelligence | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const searchAccount = async (query: string, url?: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    try {
      const newAccount = await analyzeCompany(query, url);
      const intelligence = await generateIntelligence(newAccount);
      
      setAccount(newAccount);
      setAccountIntelligence(intelligence);
      
      // Add to search history if not already there
      if (!searchHistory.includes(query)) {
        const updatedHistory = [query, ...searchHistory].slice(0, 10);
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to fetch account data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearAccount = () => {
    setAccount(null);
    setAccountIntelligence(null);
    setSearchQuery('');
  };

  const value = {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    isLoading,
    account,
    accountIntelligence,
    searchHistory,
    searchAccount,
    clearAccount,
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};