import React from 'react';
import { useAccount } from '../contexts/AccountContext';
import { Target, HelpCircle as CircleHelp, Calendar, Layers, ListChecks } from 'lucide-react';

const ProspectingStrategy: React.FC = () => {
  const { accountIntelligence } = useAccount();
  
  if (!accountIntelligence) return null;
  
  const { prospecting } = accountIntelligence;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Prospecting Approach */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <Target className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Prospecting Approach</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {prospecting.approach}
            </p>
          </div>
        </div>
      </div>

      {/* High-Impact Questions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <CircleHelp className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">High-Impact Questions</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Key questions to ask during initial outreach to generate meaningful conversations.
            </p>
          </div>
        </div>
        <ul className="mt-4 space-y-3">
          {prospecting.highImpactQuestions.map((question, index) => (
            <li key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200">
              {question}
            </li>
          ))}
        </ul>
      </div>

      {/* Meeting Format */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Suggested Meeting Format</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {prospecting.meetingFormat}
            </p>
          </div>
        </div>
      </div>

      {/* Current Technology Stack */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <Layers className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Current Technology Stack</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Key systems and technologies currently in use.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {prospecting.technologyStack.map((tech, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Event Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Suggested Event Title</h4>
            <p className="text-gray-700 dark:text-gray-300">{prospecting.eventTitle}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Event Description</h4>
            <p className="text-gray-700 dark:text-gray-300">{prospecting.eventDescription}</p>
          </div>
        </div>
      </div>

      {/* Suggested Agenda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start mb-4">
          <ListChecks className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Suggested Agenda</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Proposed timeline for the introductory meeting.
            </p>
          </div>
        </div>

        <div className="relative mt-4">
          <div
            className="absolute left-4 h-full w-0.5 bg-gray-200 dark:bg-gray-700"
            aria-hidden="true"
          ></div>

          <ul className="relative space-y-6">
            {prospecting.suggestedAgenda.map((item, index) => (
              <li key={index} className="relative pl-10">
                <div
                  className="absolute top-1 left-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">{item.durationMinutes}m</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {item.topic}
                  </h4>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProspectingStrategy;