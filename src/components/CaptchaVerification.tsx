import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw } from 'lucide-react';
import { generateCaptcha } from '../utils/adminData';
import { CaptchaChallenge } from '../types';

interface CaptchaVerificationProps {
  onVerify: (success: boolean) => void;
  isVisible: boolean;
}

export default function CaptchaVerification({ onVerify, isVisible }: CaptchaVerificationProps) {
  const [captcha, setCaptcha] = useState<CaptchaChallenge>(generateCaptcha());
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isVisible) {
      setCaptcha(generateCaptcha());
      setUserAnswer('');
      setError('');
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = parseInt(userAnswer);
    
    if (answer === captcha.answer) {
      onVerify(true);
      setError('');
    } else {
      setError('Incorrect answer. Please try again.');
      onVerify(false);
      // Generate new captcha after wrong answer
      setCaptcha(generateCaptcha());
      setUserAnswer('');
    }
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setUserAnswer('');
    setError('');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2 mb-3">
        <Shield className="h-5 w-5 text-blue-600" />
        <h4 className="font-medium text-blue-900">Security Verification</h4>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center space-x-4">
          <div className="bg-white border-2 border-blue-300 rounded-lg px-4 py-2 font-mono text-lg font-bold text-gray-900 min-w-[120px] text-center">
            {captcha.question}
          </div>
          <button
            type="button"
            onClick={refreshCaptcha}
            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
            title="Generate new captcha"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Answer"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Verify
          </button>
        </div>
        
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
      </form>
      
      <p className="text-blue-700 text-xs mt-2">
        Please solve the math problem above to continue.
      </p>
    </div>
  );
}