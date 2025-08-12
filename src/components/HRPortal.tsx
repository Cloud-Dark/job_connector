import React, { useState } from 'react';
import { Building2, Send, CheckCircle, AlertCircle, Users, MapPin } from 'lucide-react';
import { validateJobData } from '../utils/validation';
import { getAdminConfig, addJobPosting, generateCaptcha } from '../utils/adminData';
import CaptchaVerification from './CaptchaVerification';
import { ValidationResponse } from '../types';

export default function HRPortal() {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const adminConfig = getAdminConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if captcha is required and not verified
    if (adminConfig.approval_settings.require_captcha && !captchaVerified) {
      setShowCaptcha(true);
      return;
    }
    
    setIsLoading(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = validateJobData(jobDescription);
      setValidationResult(result);
      
      // If successful, add to job postings
      if (result.status === 'success' && result.job_data) {
        addJobPosting(result.job_data);
      }
      
    } catch (error) {
      console.error('Error processing job description:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setJobDescription('');
    setValidationResult(null);
    setShowCaptcha(false);
    setCaptchaVerified(false);
  };

  const handleCaptchaVerify = (success: boolean) => {
    setCaptchaVerified(success);
    setShowCaptcha(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">HR Job Posting Portal</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Input your job requirements in natural language and our AI will validate and structure the data for optimal candidate matching.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Job Requirements Description
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
              placeholder="Describe your job requirements in natural language. For example:

PT ABC Technology, alamat Jl. Sudirman No. 123 Jakarta, email hr@abc.com, telepon 021-1234567, butuh Software Developer, minimal S1 Teknik Informatika, pengalaman 2 tahun, skill PHP Laravel MySQL, kerja full-time di Jakarta, gaji 8-12 juta, tunjangan BPJS dan bonus tahunan..."
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Include company details, contact information, position requirements, skills needed, and compensation details.
            </p>
          </div>

          <CaptchaVerification
            onVerify={handleCaptchaVerify}
            isVisible={showCaptcha}
          />

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={isLoading || !jobDescription.trim() || (adminConfig.approval_settings.require_captcha && showCaptcha)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Processing...' : showCaptcha ? 'Complete Captcha First' : 'Validate & Process'}</span>
            </button>
            
            {validationResult && (
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset Form
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Validation Results */}
      {validationResult && (
        <div className="space-y-6">
          {validationResult.status === 'incomplete' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">Incomplete Information</h3>
                  <p className="text-amber-700 mb-4">{validationResult.message}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-amber-800 mb-2">Missing Required Fields:</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {validationResult.missing_fields?.map((field, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="text-amber-700">{field}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <h4 className="font-medium text-amber-800 mb-2">Example Format:</h4>
                    <p className="text-sm text-gray-700 italic">{validationResult.example}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {validationResult.status === 'success' && validationResult.job_data && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start space-x-3 mb-6">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Job Description Successfully Processed!</h3>
                  <p className="text-green-700">Your job posting has been validated and structured. Here's the processed information:</p>
                </div>
              </div>

              <div className="grid gap-6">
                {/* Company Information */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                    Company Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Company Name</p>
                      <p className="font-medium">{validationResult.job_data.company_info.company_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{validationResult.job_data.company_info.contact.email}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{validationResult.job_data.company_info.address}</p>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Job Details
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Position</p>
                      <p className="font-medium">{validationResult.job_data.job_title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Employment Type</p>
                      <p className="font-medium capitalize">{validationResult.job_data.job_details.employment_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Experience Level</p>
                      <p className="font-medium capitalize">{validationResult.job_data.job_details.job_level}</p>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Requirements
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Education</p>
                      <p className="font-medium">{validationResult.job_data.requirements.education.min_degree}</p>
                      <p className="text-sm text-gray-500">
                        {validationResult.job_data.requirements.education.preferred_major.join(', ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Experience</p>
                      <p className="font-medium">{validationResult.job_data.requirements.experience.min_years} years minimum</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-2">Technical Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {validationResult.job_data.requirements.skills.technical_skills.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary Information */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Compensation</h4>
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-600">Salary Range</p>
                      <p className="font-medium">
                        {(validationResult.job_data.compensation.salary_range.min / 1000000).toFixed(1)}M - {(validationResult.job_data.compensation.salary_range.max / 1000000).toFixed(1)}M IDR
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-medium mb-1">✅ Job posting is ready for publication!</p>
                <p className="text-blue-700 text-sm">
                  Your job posting has been {adminConfig.approval_settings.auto_approve_jobs ? 'automatically approved and is now live' : 'submitted for admin approval'}. 
                  {!adminConfig.approval_settings.auto_approve_jobs && ' Once approved, it will be visible to candidates.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}