import React from 'react';
import { useAccount } from '../contexts/AccountContext';
import { Building, TrendingUp, Briefcase, Users, Shield, Target, Newspaper, Cpu, FileText } from 'lucide-react';

const AccountOverview: React.FC = () => {
  const { accountIntelligence } = useAccount();
  
  if (!accountIntelligence) return null;
  
  const { overview } = accountIntelligence;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Company Description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <Building className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Company Description</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {overview.description}
            </p>
          </div>
        </div>
      </div>

      {/* Recent News */}
      {overview.recentNews && overview.recentNews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start mb-4">
            <Newspaper className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent News</h3>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {overview.recentNews.map((news, index) => (
              <div key={index} className="py-4 first:pt-0 last:pb-0">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  <a href={news.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {news.title}
                  </a>
                </h4>
                <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                  <span>{news.source}</span>
                  {news.date && (
                    <>
                      <span>•</span>
                      <span>{news.date}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technology Stack */}
      {overview.technologyStack && overview.technologyStack.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start mb-4">
            <Cpu className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Technology Stack</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {overview.technologyStack.map((tech, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 dark:text-white">{tech.name}</h4>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{tech.description || tech.categories.join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Press Releases & Financial Documents */}
      {((overview.pressReleases && overview.pressReleases.length > 0) || 
        (overview.financialDocuments && overview.financialDocuments.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Press Releases */}
          {overview.pressReleases && overview.pressReleases.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-start mb-4">
                <Newspaper className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Press Releases</h3>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {overview.pressReleases.map((press, index) => (
                  <div key={index} className="py-3 first:pt-0 last:pb-0">
                    <a 
                      href={press.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {press.title}
                    </a>
                    {press.date && <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{press.date}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Financial Documents */}
          {overview.financialDocuments && overview.financialDocuments.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-start mb-4">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Financial Documents</h3>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {overview.financialDocuments.map((doc, index) => (
                  <div key={index} className="py-3 first:pt-0 last:pb-0">
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {doc.title}
                    </a>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{doc.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Industry Outlook */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Industry Outlook</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {overview.industryOutlook}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Financial Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</p>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{overview.financialMetrics.revenue}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Growth Rate</p>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{overview.financialMetrics.growthRate}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Profit Margins</p>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{overview.financialMetrics.profitMargins}</p>
          </div>
        </div>
      </div>

      {/* Strategic Initiatives */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <Target className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Strategic Initiatives</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Short-term</h4>
            <ul className="space-y-1">
              {overview.strategicInitiatives.shortTerm.map((item, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Mid-term</h4>
            <ul className="space-y-1">
              {overview.strategicInitiatives.midTerm.map((item, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Long-term</h4>
            <ul className="space-y-1">
              {overview.strategicInitiatives.longTerm.map((item, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Competitive Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Competitive Analysis</h3>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          {overview.competitiveAnalysis.map((competitor, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
              <h4 className="font-medium text-gray-900 dark:text-white">{competitor.name}</h4>
              <ul className="mt-2 space-y-1">
                {competitor.differentiationPoints.map((point, pointIndex) => (
                  <li key={pointIndex} className="text-gray-700 dark:text-gray-300 flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column layout for Competitive Advantages and Business Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Competitive Advantages */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start mb-4">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Competitive Advantages</h3>
            </div>
          </div>
          <ul className="mt-2 space-y-3">
            {overview.competitiveAdvantages.map((advantage, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                {advantage}
              </li>
            ))}
          </ul>
        </div>

        {/* Business Challenges */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start mb-4">
            <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Key Business Challenges</h3>
            </div>
          </div>
          <ul className="mt-2 space-y-3">
            {overview.keyBusinessChallenges.map((challenge, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                {challenge}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Contacts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recommended Contacts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Why Relevant
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {overview.recommendedContacts.map((contact, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {contact.role}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {contact.whyRelevant}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;