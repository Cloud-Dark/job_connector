import React from 'react';
import { Users, FileText, Target, Briefcase, UserCheck, Settings } from 'lucide-react';

interface HeaderProps {
  currentView: 'hr' | 'candidate' | 'jobs' | 'cvs' | 'admin';
  onViewChange: (view: 'hr' | 'candidate' | 'jobs' | 'cvs' | 'admin') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">JobMatch AI</h1>
              <p className="text-sm text-gray-600">Intelligent Job Matching Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
            <button
              onClick={() => onViewChange('hr')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                currentView === 'hr'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>HR Portal</span>
            </button>
            <button
              onClick={() => onViewChange('candidate')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                currentView === 'candidate'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Job Seekers</span>
            </button>
            <button
              onClick={() => onViewChange('jobs')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                currentView === 'jobs'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>All Jobs</span>
            </button>
            <button
              onClick={() => onViewChange('cvs')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                currentView === 'cvs'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>All CVs</span>
            </button>
            <button
              onClick={() => onViewChange('admin')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                currentView === 'admin'
                  ? 'bg-white text-red-600 shadow-md'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}