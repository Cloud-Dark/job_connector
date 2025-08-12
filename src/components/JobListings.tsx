import React from 'react';
import { MapPin, Clock, DollarSign, Building2, Mail, Phone } from 'lucide-react';
import { getApprovedJobPostings } from '../utils/adminData';
import { JobPosting } from '../types';

export default function JobListings() {
  const jobPostings = getApprovedJobPostings();

  if (jobPostings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Jobs Available</h2>
          <p className="text-gray-600">There are currently no approved job postings available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Job Opportunities</h2>
        <p className="text-gray-600">Browse through our curated list of job openings</p>
      </div>

      <div className="grid gap-6">
        {jobPostings.map((job: JobPosting) => (
          <div key={job.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.job_data.job_title}</h3>
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{job.job_data.company_info.company_name}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.job_data.job_details.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className="capitalize">{job.job_data.job_details.employment_type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {(job.job_data.compensation.salary_range.min / 1000000).toFixed(1)}M - {(job.job_data.compensation.salary_range.max / 1000000).toFixed(1)}M IDR
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  job.job_data.job_details.job_level === 'senior' ? 'bg-purple-100 text-purple-800' :
                  job.job_data.job_details.job_level === 'mid' ? 'bg-blue-100 text-blue-800' :
                  job.job_data.job_details.job_level === 'junior' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.job_data.job_details.job_level} level
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-3">{job.job_data.job_description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {job.job_data.requirements.education.min_degree} in {job.job_data.requirements.education.preferred_major.join(' or ')}</li>
                    <li>• {job.job_data.requirements.experience.min_years}+ years of experience</li>
                    <li>• Skills: {job.job_data.requirements.skills.technical_skills.slice(0, 3).join(', ')}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                  <div className="flex flex-wrap gap-1">
                    {job.job_data.compensation.benefits.map((benefit, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <a
                      href={`mailto:${job.job_data.company_info.contact.email}`}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{job.job_data.company_info.contact.email}</span>
                    </a>
                    <a
                      href={`tel:${job.job_data.company_info.contact.phone}`}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{job.job_data.company_info.contact.phone}</span>
                    </a>
                  </div>
                </div>
                
                <div className="text-right">
                  {job.job_data.application_info.deadline && (
                    <p className="text-sm text-gray-500">
                      Apply by: {new Date(job.job_data.application_info.deadline).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Posted: {new Date(job.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}