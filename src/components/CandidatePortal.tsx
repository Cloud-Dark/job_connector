import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Clock, Mail, Phone, Target, TrendingUp } from 'lucide-react';
import { mockJobMatching } from '../utils/validation';
import { getAdminConfig, addCVSubmission } from '../utils/adminData';
import CaptchaVerification from './CaptchaVerification';
import { MatchingResponse } from '../types';

export default function CandidatePortal() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchingResult, setMatchingResult] = useState<MatchingResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const adminConfig = getAdminConfig();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    // Check if captcha is required and not verified
    if (adminConfig.approval_settings.require_captcha && !captchaVerified) {
      setShowCaptcha(true);
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockJobMatching(selectedFile);
      setMatchingResult(result);
      
      // Add CV submission to admin data
      addCVSubmission(result.candidate_profile, selectedFile.name);
      
    } catch (error) {
      console.error('Error processing CV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setMatchingResult(null);
    setShowCaptcha(false);
    setCaptchaVerified(false);
  };

  const handleCaptchaVerify = (success: boolean) => {
    setCaptchaVerified(success);
    setShowCaptcha(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Seeker Portal</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your CV and let our AI find the perfect job matches for your skills and experience.
        </p>
      </div>

      {!matchingResult && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Your CV
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    dragActive
                      ? 'border-green-400 bg-green-50'
                      : selectedFile
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    {selectedFile ? (
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-green-600">File Selected</p>
                        <p className="text-gray-600">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-900">
                          Drop your CV here, or <span className="text-green-600">browse</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports PDF, DOC, DOCX files up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <CaptchaVerification
                onVerify={handleCaptchaVerify}
                isVisible={showCaptcha}
              />

              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={isLoading || !selectedFile || (adminConfig.approval_settings.require_captcha && showCaptcha)}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Processing CV...</span>
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4" />
                      <span>{showCaptcha ? 'Complete Captcha First' : 'Find Job Matches'}</span>
                    </>
                  )}
                </button>
                
                {selectedFile && !isLoading && (
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>

          {isLoading && (
            <div className="mt-8 bg-blue-50 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-medium text-blue-800">Processing Your CV</span>
              </div>
              <p className="text-blue-700 mb-4">
                Our AI is analyzing your profile and matching it with available positions...
              </p>
              <div className="bg-blue-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-1/3 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Matching Results */}
      {matchingResult && (
        <div className="space-y-6">
          {/* Success Header */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-1">CV Analysis Complete!</h3>
                <p className="text-green-700">
                  Found <strong>{matchingResult.summary.total_jobs_found}</strong> job matches for your profile.
                  Best match: <strong>{matchingResult.summary.best_match_percentage}%</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-blue-600" />
              Your Profile Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {matchingResult.candidate_profile.name}</p>
                  <p><span className="font-medium">Education:</span> {matchingResult.candidate_profile.education.degree} {matchingResult.candidate_profile.education.major}</p>
                  <p><span className="font-medium">Experience:</span> {matchingResult.candidate_profile.experience.total_years} years</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Skills Overview</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Technical Skills</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {matchingResult.candidate_profile.skills.technical_skills.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Recommendations */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Target className="h-6 w-6 mr-2 text-green-600" />
              Job Recommendations
            </h3>
            
            {matchingResult.job_recommendations.map((job, index) => (
              <div key={job.job_id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900">{job.job_title}</h4>
                    <p className="text-gray-600">{job.company_name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salary_range}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      job.match_percentage >= 90 ? 'text-green-600' :
                      job.match_percentage >= 80 ? 'text-blue-600' :
                      'text-amber-600'
                    }`}>
                      {job.match_percentage}%
                    </div>
                    <p className="text-xs text-gray-500">Match</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      Why You Match
                    </h5>
                    <ul className="space-y-1 text-sm">
                      {job.why_matched.map((reason, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span className="text-gray-700">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-amber-500" />
                      Areas to Improve
                    </h5>
                    <ul className="space-y-1 text-sm">
                      {job.areas_to_improve.map((area, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span className="text-gray-700">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">💡 Application Tips</h5>
                  <p className="text-blue-800 text-sm">{job.application_tips}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2">Contact Information</h5>
                  <div className="flex items-center space-x-6 text-sm">
                    <a
                      href={`mailto:${job.contact_info.email}`}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{job.contact_info.email}</span>
                    </a>
                    <a
                      href={`tel:${job.contact_info.phone}`}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{job.contact_info.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skill Recommendations */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📚 Recommended Skills to Learn</h3>
            <div className="flex flex-wrap gap-2">
              {matchingResult.summary.recommended_skills_to_learn.map((skill, index) => (
                <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-sm mt-3">
              Learning these skills could improve your match percentage and open up more opportunities.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Upload New CV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}