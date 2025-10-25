import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PasswordInput from '../components/PasswordInput';
import { HiMail, HiArrowRight, HiEye, HiEyeOff } from 'react-icons/hi';

/* // Demo user credentials
const DEMO_EMAIL = 'test@example.com';
const DEMO_PASSWORD = 'password123'; */

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(''); // Clear previous server errors
    setIsLoading(true);
    try {
      await login(email, password);
      // Toast handled globally in AuthContext
    } catch (error) {
      setServerError(error.message);
      // Toast handled globally in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  /* const handleFillDemoCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }; */

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#CEF549] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#CEF549] to-[#FDE04C] opacity-90"></div>
        
        {/* Illustration Container */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          {/* Your Provided Bird Illustration */}
          <div className="mb-8 w-80 h-80 relative">
            <img 
              src="/pexels-karola-g-5412135.jpg" 
              alt="Bird illustration" 
              className="w-full h-full object-contain"
            />
            {/* Fallback SVG if image doesn't load */}
            <svg viewBox="0 0 300 300" className="w-full h-full hidden">
              {/* Bird with heart-shaped body */}
              <path d="M150 200 C 120 200, 100 180, 100 150 C 100 120, 120 100, 150 100 C 180 100, 200 120, 200 150 C 200 180, 180 200, 150 200 Z" fill="#8B4513" />
              {/* Bird eyes */}
              <circle cx="130" cy="130" r="8" fill="#FF8C42" />
              <circle cx="170" cy="130" r="8" fill="#FF8C42" />
              {/* Bird tail */}
              <ellipse cx="150" cy="220" rx="20" ry="15" fill="#8B4513" />
              {/* Confetti particles */}
              <circle cx="80" cy="100" r="4" fill="#FF69B4" />
              <circle cx="220" cy="120" r="3" fill="#87CEEB" />
              <circle cx="70" cy="180" r="5" fill="#FFA500" />
              <circle cx="230" cy="160" r="4" fill="#FF69B4" />
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
            <div className="w-2 h-2 rounded-full bg-[#292929]"></div>
            <div className="w-2 h-2 rounded-full bg-[#292929] opacity-30"></div>
            <div className="w-2 h-2 rounded-full bg-[#292929] opacity-30"></div>
            <div className="w-2 h-2 rounded-full bg-[#292929] opacity-30"></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
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
                Users name or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiMail aria-hidden="true" className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  placeholder="David Brooks" 
                  className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-300 bg-transparent text-[#292929] placeholder-gray-400 focus:outline-none focus:border-[#CEF549] transition-colors duration-200" 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
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
                  className="w-full px-4 py-3 border-b-2 border-gray-300 bg-transparent text-[#292929] placeholder-gray-400 focus:outline-none focus:border-[#CEF549] transition-colors duration-200" 
                  id="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-gray-500 hover:text-[#292929] transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
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
                  Signing in...
                </>
              ) : (
                'Sign in'
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
              Sign in with Google
            </button>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                New Bento? <Link 
                  to="/register" 
                  className="text-[#292929] hover:text-[#CEF549] font-semibold underline transition-colors duration-200"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}