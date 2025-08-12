import React from 'react';
import { User, GraduationCap, Briefcase, Mail, Phone, MapPin } from 'lucide-react';
import { getApprovedCVSubmissions } from '../utils/adminData';
import { CVSubmission } from '../types';

export default function CVListings() {
  const cvSubmissions = getApprovedCVSubmissions();

  if (cvSubmissions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No CVs Available</h2>
          <p className="text-gray-600">There are currently no approved CV submissions available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Candidates</h2>
        <p className="text-gray-600">Browse through our pool of qualified candidates</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cvSubmissions.map((cv: CVSubmission) => (
          <div key={cv.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{cv.candidate_profile.name}</h3>
              <p className="text-gray-600">{cv.candidate_profile.education.major}</p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <GraduationCap className="h-4 w-4 text-blue-500" />
                <span>{cv.candidate_profile.education.degree} - {cv.candidate_profile.education.university}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Briefcase className="h-4 w-4 text-green-500" />
                <span>{cv.candidate_profile.experience.total_years} years experience</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>{cv.candidate_profile.location_preference}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Technical Skills</h4>
              <div className="flex flex-wrap gap-1">
                {cv.candidate_profile.skills.technical_skills.slice(0, 4).map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
                {cv.candidate_profile.skills.technical_skills.length > 4 && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    +{cv.candidate_profile.skills.technical_skills.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Recent Experience</h4>
              {cv.candidate_profile.experience.positions.slice(0, 1).map((position, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">{position.title}</p>
                  <p className="text-sm text-gray-600">{position.company}</p>
                  <p className="text-xs text-gray-500">{position.duration}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
              <div className="space-y-2">
                <a
                  href={`mailto:${cv.candidate_profile.email}`}
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>{cv.candidate_profile.email}</span>
                </a>
                <a
                  href={`tel:${cv.candidate_profile.phone}`}
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>{cv.candidate_profile.phone}</span>
                </a>
              </div>
              
              <div className="mt-3 text-right">
                <p className="text-xs text-gray-400">
                  Submitted: {new Date(cv.submitted_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}