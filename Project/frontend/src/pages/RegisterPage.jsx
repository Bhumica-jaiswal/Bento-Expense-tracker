import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PasswordInput from '../components/PasswordInput';
import { HiMail, HiArrowRight, HiCheckCircle, HiXCircle } from 'react-icons/hi';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return null;
    const hasLength = password.length >= 8 && password.length <= 16;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[\W_]/.test(password);
    
    const criteria = [hasLength, hasLetter, hasDigit, hasSymbol];
    const metCriteria = criteria.filter(Boolean).length;
    
    return {
      hasLength,
      hasLetter,
      hasDigit,
      hasSymbol,
      strength: metCriteria
    };
  };

  const passwordStrength = getPasswordStrength();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    } else {
      // Frontend blacklist for instant feedback
      const domain = email.split('@')[1];
      const blockedDomains = ['example.com', 'test.com', 'invalid.com'];
      if (blockedDomains.includes(domain)) {
        newErrors.email = 'This email domain is not allowed.';
      }
    }

    if (password.length < 8 || password.length > 16) {
      newErrors.password = 'Password must be 8-16 characters long.';
    } else {
      const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_])/;
      if (!passwordRegex.test(password)) {
        newErrors.password = 'Password must contain an alphabet, a digit, and a symbol.';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    
    try {
      await signup(email, password);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordCriterion = ({ met, text }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <HiCheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 flex-shrink-0" />
      ) : (
        <HiXCircle className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
      )}
      <span className={`${met ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FDE04C] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDE04C] to-[#CEF549] opacity-90"></div>
        
        {/* Illustration Container */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          {/* Your Provided Office Supplies Illustration */}
          <div className="mb-8 w-80 h-80 relative">
            <img 
              src="/pexels-karola-g-5412135.jpg" 
              alt="Office supplies illustration" 
              className="w-full h-full object-contain"
            />
            {/* Fallback SVG if image doesn't load */}
            <svg viewBox="0 0 300 300" className="w-full h-full hidden">
              {/* Calculator */}
              <rect x="50" y="100" width="60" height="80" rx="8" fill="#FF69B4" />
              <rect x="55" y="105" width="50" height="15" fill="#292929" />
              <rect x="60" y="130" width="8" height="8" rx="2" fill="#FFFFFF" />
              <rect x="72" y="130" width="8" height="8" rx="2" fill="#FFFFFF" />
              <rect x="84" y="130" width="8" height="8" rx="2" fill="#FFFFFF" />
              <rect x="96" y="130" width="8" height="8" rx="2" fill="#FFFFFF" />
              
              {/* Sticky Notes */}
              <rect x="150" y="80" width="40" height="30" rx="4" fill="#FFFF00" />
              <rect x="160" y="90" width="20" height="2" fill="#292929" />
              <rect x="160" y="95" width="15" height="2" fill="#292929" />
              <rect x="160" y="100" width="18" height="2" fill="#292929" />
              
              {/* Scissors */}
              <ellipse cx="200" cy="200" rx="15" ry="8" fill="#FF69B4" transform="rotate(45 200 200)" />
              <circle cx="200" cy="200" r="3" fill="#FDE04C" />
              
              {/* Highlighter */}
              <rect x="100" y="180" width="8" height="40" rx="4" fill="#4ECDC4" />
            </svg>
          </div>
          
          {/* Text Content */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#292929] mb-4">
              Maecenas mattis egestas
            </h2>
            <p className="text-[#292929] text-sm opacity-80 leading-relaxed">
              Erdum et malesuada fames ac ante ipsum primis in faucibus uspendisse porta.
            </p>
          </div>
          
          {/* Pagination Indicators */}
          <div className="absolute bottom-8 flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#292929] opacity-30"></div>
            <div className="w-2 h-2 rounded-full bg-[#292929] opacity-30"></div>
            <div className="w-2 h-2 rounded-full bg-[#292929]"></div>
            <div className="w-2 h-2 rounded-full bg-[#292929] opacity-30"></div>
            <div className="w-2 h-2 rounded-full bg-[#292929] opacity-30"></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="max-w-md mx-auto w-full">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <Link 
              to="/" 
              className="text-4xl font-bold text-[#292929] mb-2 block"
              title="Go to home"
            >
              Bento
            </Link>
            <p className="text-[#292929] text-lg">Welcome to Bento</p>
          </div>

          {/* Error Message */}
          {serverError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 animate-shake">
              <p className="text-sm text-red-600 text-center font-medium">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiMail aria-hidden="true" className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 border-b-2 bg-transparent text-[#292929] placeholder-gray-400 focus:outline-none transition-colors duration-200 ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-[#CEF549]'
                  }`}
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <HiXCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border-b-2 bg-transparent text-[#292929] placeholder-gray-400 focus:outline-none transition-colors duration-200 ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-[#CEF549]'
                  }`}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <HiXCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}

              {/* Password Strength Indicator */}
              {password && passwordStrength && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-[#292929] mb-3">
                    Password Requirements:
                  </p>
                  <div className="space-y-2">
                    <PasswordCriterion met={passwordStrength.hasLength} text="8-16 characters" />
                    <PasswordCriterion met={passwordStrength.hasLetter} text="At least one letter" />
                    <PasswordCriterion met={passwordStrength.hasDigit} text="At least one number" />
                    <PasswordCriterion met={passwordStrength.hasSymbol} text="At least one symbol" />
                  </div>
                  {/* Strength Bar */}
                  <div className="mt-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength.strength >= level
                              ? passwordStrength.strength === 4
                                ? 'bg-green-500'
                                : passwordStrength.strength === 3
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 text-white font-semibold bg-[#292929] rounded-lg hover:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#CEF549] focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button 
              type="button"
              className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#CEF549] focus:ring-offset-2 transform transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Already have an account? <Link 
                  to="/login" 
                  className="text-[#292929] hover:text-[#CEF549] font-semibold underline transition-colors duration-200"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-8 text-sm text-gray-500 text-center">
            By signing up, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}