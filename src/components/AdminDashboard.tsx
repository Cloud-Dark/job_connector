import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  LogOut,
  Save,
  RefreshCw,
  Key,
  MessageSquare,
  Sliders
} from 'lucide-react';
import {
  getAdminConfig,
  updateAdminConfig,
  getAllJobPostings,
  getAllCVSubmissions,
  approveJobPosting,
  rejectJobPosting,
  approveCVSubmission,
  rejectCVSubmission
} from '../utils/adminData';
import { AdminConfig, JobPosting, CVSubmission } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'cvs' | 'config'>('overview');
  const [config, setConfig] = useState<AdminConfig>(getAdminConfig());
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [cvSubmissions, setCvSubmissions] = useState<CVSubmission[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedCV, setSelectedCV] = useState<CVSubmission | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setJobPostings(getAllJobPostings());
    setCvSubmissions(getAllCVSubmissions());
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateAdminConfig(config);
    setIsSaving(false);
  };

  const handleJobAction = (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      approveJobPosting(id);
    } else {
      rejectJobPosting(id);
    }
    loadData();
  };

  const handleCVAction = (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      approveCVSubmission(id);
    } else {
      rejectCVSubmission(id);
    }
    loadData();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center"><CheckCircle className="h-3 w-3 mr-1" />Approved</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium flex items-center"><XCircle className="h-3 w-3 mr-1" />Rejected</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center"><Clock className="h-3 w-3 mr-1" />Pending</span>;
    }
  };

  const stats = {
    totalJobs: jobPostings.length,
    approvedJobs: jobPostings.filter(j => j.status === 'approved').length,
    pendingJobs: jobPostings.filter(j => j.status === 'pending').length,
    totalCVs: cvSubmissions.length,
    approvedCVs: cvSubmissions.filter(c => c.status === 'approved').length,
    pendingCVs: cvSubmissions.filter(c => c.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">JobMatch AI Management</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Settings },
            { id: 'jobs', label: 'Job Postings', icon: Briefcase },
            { id: 'cvs', label: 'CV Submissions', icon: Users },
            { id: 'config', label: 'Configuration', icon: Sliders }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-red-600 shadow-md'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-4 flex items-center space-x-4 text-sm">
                  <span className="text-green-600">✓ {stats.approvedJobs} Approved</span>
                  <span className="text-yellow-600">⏳ {stats.pendingJobs} Pending</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total CVs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCVs}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-4 flex items-center space-x-4 text-sm">
                  <span className="text-green-600">✓ {stats.approvedCVs} Approved</span>
                  <span className="text-yellow-600">⏳ {stats.pendingCVs} Pending</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Status</p>
                    <p className="text-lg font-bold text-green-600">Active</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>API: {config.gemini_api_key ? 'Configured' : 'Not Set'}</p>
                  <p>Auto Approval: {config.approval_settings.auto_approve_jobs ? 'On' : 'Off'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[...jobPostings, ...cvSubmissions]
                  .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {'job_data' in item ? <Briefcase className="h-5 w-5 text-blue-600" /> : <Users className="h-5 w-5 text-green-600" />}
                        <div>
                          <p className="font-medium text-gray-900">
                            {'job_data' in item ? item.job_data.job_title : item.candidate_profile.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {'job_data' in item ? item.job_data.company_info.company_name : item.candidate_profile.email}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Job Postings Management</h3>
              <button
                onClick={loadData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobPostings.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{job.job_data.job_title}</p>
                            <p className="text-sm text-gray-600">{job.job_data.job_details.location} • {job.job_data.job_details.employment_type}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{job.job_data.company_info.company_name}</p>
                            <p className="text-sm text-gray-600">{job.job_data.company_info.contact.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(job.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(job.submitted_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedJob(job)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {job.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleJobAction(job.id, 'approve')}
                                  className="text-green-600 hover:text-green-800 transition-colors"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleJobAction(job.id, 'reject')}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CVs Tab */}
        {activeTab === 'cvs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">CV Submissions Management</h3>
              <button
                onClick={loadData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cvSubmissions.map((cv) => (
                      <tr key={cv.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{cv.candidate_profile.name}</p>
                            <p className="text-sm text-gray-600">{cv.candidate_profile.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{cv.candidate_profile.education.degree}</p>
                            <p className="text-sm text-gray-600">{cv.candidate_profile.education.major}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {cv.candidate_profile.experience.total_years} years
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(cv.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(cv.submitted_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedCV(cv)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {cv.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleCVAction(cv.id, 'approve')}
                                  className="text-green-600 hover:text-green-800 transition-colors"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleCVAction(cv.id, 'reject')}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Tab */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">System Configuration</h3>
              <button
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </div>

            <div className="grid gap-6">
              {/* API Configuration */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Key className="h-5 w-5 mr-2 text-blue-600" />
                  API Configuration
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gemini API Key
                    </label>
                    <input
                      type="password"
                      value={config.gemini_api_key}
                      onChange={(e) => setConfig({ ...config, gemini_api_key: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your Gemini API key"
                    />
                  </div>
                </div>
              </div>

              {/* Prompts Configuration */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                  AI Prompts Configuration
                </h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Processing Prompt
                    </label>
                    <textarea
                      value={config.job_processing_prompt}
                      onChange={(e) => setConfig({ ...config, job_processing_prompt: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CV Processing Prompt
                    </label>
                    <textarea
                      value={config.cv_processing_prompt}
                      onChange={(e) => setConfig({ ...config, cv_processing_prompt: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Matching Parameters */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Sliders className="h-5 w-5 mr-2 text-purple-600" />
                  Matching Parameters (%)
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(config.matching_parameters).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key.replace('_', ' ')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => setConfig({
                          ...config,
                          matching_parameters: {
                            ...config.matching_parameters,
                            [key]: parseInt(e.target.value) || 0
                          }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Total: {Object.values(config.matching_parameters).reduce((a, b) => a + b, 0)}%
                    {Object.values(config.matching_parameters).reduce((a, b) => a + b, 0) !== 100 && (
                      <span className="text-red-600 ml-2">⚠️ Should total 100%</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Approval Settings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Approval Settings
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Auto-approve Job Postings</p>
                      <p className="text-sm text-gray-600">Automatically approve new job submissions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.approval_settings.auto_approve_jobs}
                        onChange={(e) => setConfig({
                          ...config,
                          approval_settings: {
                            ...config.approval_settings,
                            auto_approve_jobs: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Auto-approve CV Submissions</p>
                      <p className="text-sm text-gray-600">Automatically approve new CV uploads</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.approval_settings.auto_approve_cvs}
                        onChange={(e) => setConfig({
                          ...config,
                          approval_settings: {
                            ...config.approval_settings,
                            auto_approve_cvs: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Require Captcha</p>
                      <p className="text-sm text-gray-600">Show captcha verification for submissions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.approval_settings.require_captcha}
                        onChange={(e) => setConfig({
                          ...config,
                          approval_settings: {
                            ...config.approval_settings,
                            require_captcha: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedJob.job_data.job_title}</h3>
                  <p className="text-gray-600">{selectedJob.job_data.company_info.company_name}</p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Company Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Address:</strong> {selectedJob.job_data.company_info.address}</p>
                    <p><strong>Email:</strong> {selectedJob.job_data.company_info.contact.email}</p>
                    <p><strong>Phone:</strong> {selectedJob.job_data.company_info.contact.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Job Requirements</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Education:</strong> {selectedJob.job_data.requirements.education.min_degree}</p>
                    <p><strong>Experience:</strong> {selectedJob.job_data.requirements.experience.min_years} years</p>
                    <p><strong>Skills:</strong> {selectedJob.job_data.requirements.skills.technical_skills.join(', ')}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Compensation</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Salary:</strong> {(selectedJob.job_data.compensation.salary_range.min / 1000000).toFixed(1)}M - {(selectedJob.job_data.compensation.salary_range.max / 1000000).toFixed(1)}M IDR</p>
                    <p><strong>Benefits:</strong> {selectedJob.job_data.compensation.benefits.join(', ')}</p>
                  </div>
                </div>
              </div>
              
              {selectedJob.status === 'pending' && (
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => {
                      handleJobAction(selectedJob.id, 'approve');
                      setSelectedJob(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => {
                      handleJobAction(selectedJob.id, 'reject');
                      setSelectedJob(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CV Detail Modal */}
      {selectedCV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCV.candidate_profile.name}</h3>
                  <p className="text-gray-600">{selectedCV.candidate_profile.email}</p>
                </div>
                <button
                  onClick={() => setSelectedCV(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Degree:</strong> {selectedCV.candidate_profile.education.degree}</p>
                    <p><strong>Major:</strong> {selectedCV.candidate_profile.education.major}</p>
                    <p><strong>University:</strong> {selectedCV.candidate_profile.education.university}</p>
                    <p><strong>Graduation:</strong> {selectedCV.candidate_profile.education.graduation_year}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Total Years:</strong> {selectedCV.candidate_profile.experience.total_years}</p>
                    {selectedCV.candidate_profile.experience.positions.map((pos, index) => (
                      <div key={index} className="mt-2 p-2 bg-white rounded border">
                        <p><strong>{pos.title}</strong> at {pos.company}</p>
                        <p className="text-sm text-gray-600">{pos.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Technical:</strong> {selectedCV.candidate_profile.skills.technical_skills.join(', ')}</p>
                    <p><strong>Soft Skills:</strong> {selectedCV.candidate_profile.skills.soft_skills.join(', ')}</p>
                  </div>
                </div>
              </div>
              
              {selectedCV.status === 'pending' && (
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => {
                      handleCVAction(selectedCV.id, 'approve');
                      setSelectedCV(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => {
                      handleCVAction(selectedCV.id, 'reject');
                      setSelectedCV(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}