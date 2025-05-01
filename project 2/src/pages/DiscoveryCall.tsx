import React from 'react';
import { useAccount } from '../contexts/AccountContext';
import { HelpCircle as CircleHelp, MessageSquare, Calendar, BarChart, Clock } from 'lucide-react';

const DiscoveryCall: React.FC = () => {
  const { accountIntelligence } = useAccount();
  
  if (!accountIntelligence) return null;
  
  const { discovery } = accountIntelligence;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Discovery Questions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <CircleHelp className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Discovery Questions</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Targeted questions to uncover needs, pain points, and opportunities.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {discovery.discoveryQuestions.map((question, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex items-start">
                <span className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-gray-800 dark:text-gray-200">{question}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upfront Contract Script */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Upfront Contract Script</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Suggested opening to set expectations for the meeting.
            </p>
          </div>
        </div>
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-700 p-4 rounded-r-lg">
          <p className="italic text-gray-700 dark:text-gray-300">"{discovery.upfrontContractScript}"</p>
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Event Details</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Suggested Event Title</h4>
            <p className="text-gray-700 dark:text-gray-300">{discovery.eventTitle}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Event Description</h4>
            <p className="text-gray-700 dark:text-gray-300">{discovery.eventDescription}</p>
          </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <BarChart className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Value Propositions</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Key value statements aligned to likely pain points.
            </p>
          </div>
        </div>
        <ul className="mt-4 space-y-3">
          {discovery.valuePropositions.map((value, index) => (
            <li key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-start">
              <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                <span className="text-green-700 dark:text-green-300 text-sm">✓</span>
              </div>
              <p className="text-gray-800 dark:text-gray-200">{value}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Call Framework */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Call Framework</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Suggested timing and topics for an effective discovery call.
            </p>
          </div>
        </div>

        <div className="relative mt-4">
          <div
            className="absolute left-4 h-full w-0.5 bg-gray-200 dark:bg-gray-700"
            aria-hidden="true"
          ></div>

          <ul className="relative space-y-6">
            {discovery.callFramework.map((segment, index) => (
              <li key={index} className="relative pl-10">
                <div
                  className="absolute top-1 left-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">{segment.durationMinutes}m</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {segment.segment}
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {segment.keyPoints.map((point, pointIndex) => (
                      <li key={pointIndex} className="text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryCall;