import React from 'react';
import { useAccount } from '../contexts/AccountContext';
import { Lightbulb, BarChart3, LineChart, BarChart, ShieldCheck } from 'lucide-react';

const ValueProposition: React.FC = () => {
  const { accountIntelligence } = useAccount();
  
  if (!accountIntelligence) return null;
  
  const { valueProposition } = accountIntelligence;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Point of View */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Point of View</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Customized perspective on how Salesforce addresses specific challenges.
            </p>
          </div>
        </div>
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-700 p-4 rounded-r-lg">
          <p className="text-gray-700 dark:text-gray-300">{valueProposition.pointOfView}</p>
        </div>
      </div>

      {/* Implementation Roadmap */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Implementation Roadmap</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Phased implementation approach for Salesforce solutions.
            </p>
          </div>
        </div>

        <div className="relative mt-6">
          <div className="absolute left-8 top-5 h-full w-1 bg-blue-200 dark:bg-blue-800" aria-hidden="true"></div>

          <ol className="relative space-y-10">
            {valueProposition.implementationRoadmap.map((phase, index) => (
              <li key={index} className="relative mb-6 sm:mb-0">
                <div className="flex items-start">
                  <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full ring-0 ring-white sm:ring-8 shrink-0 ml-5">
                    <span className="text-white text-xs">{index + 1}</span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {phase.phase}
                      <span className="ml-2 text-sm font-normal text-blue-600 dark:text-blue-400">
                        {phase.timeline}
                      </span>
                    </h4>
                    <p className="text-base text-gray-700 dark:text-gray-300 mt-1">{phase.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Expected ROI */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <LineChart className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Expected ROI</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Projected business impact metrics.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {valueProposition.expectedROI.map((item, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{item.metric}</h4>
              <p className="text-gray-700 dark:text-gray-300">{item.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Case Studies */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <BarChart className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Case Studies</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Success stories from similar companies.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-6">
          {valueProposition.caseStudies.map((caseStudy, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{caseStudy.company}</h4>
              
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Challenge</h5>
                  <p className="text-gray-700 dark:text-gray-300">{caseStudy.challenge}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Solution</h5>
                  <p className="text-gray-700 dark:text-gray-300">{caseStudy.solution}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Results</h5>
                  <p className="text-green-600 dark:text-green-400 font-medium">{caseStudy.results}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Potential Objections */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Objection Handling</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Prepared responses to common objections.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {valueProposition.potentialObjections.map((objection, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
              <h4 className="font-medium text-gray-900 dark:text-white">{objection.objection}</h4>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{objection.response}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValueProposition;