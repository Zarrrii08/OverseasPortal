import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function WelcomeBanner() {
  const { user } = useAuth();
  const userName = user?.name || user?.username || 'User';

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden animate-scaleIn">
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1 animate-slideInLeft">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
            Welcome to <span className="text-blue-100">Linguist Hub</span> Telephone Interpreting
          </h1>
          <h2 className="text-white text-3xl md:text-4xl font-bold">
            {userName} : Rizwan Haider
          </h2>
        </div>
        
        {/* Illustration */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            {/* Person 1 */}
            <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center shadow-xl">
              <div className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Document icon */}
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center shadow-lg transform rotate-12">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          {/* Person 2 */}
          <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center shadow-xl">
            <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* 24/7 Badge */}
          <div className="absolute -bottom-2 right-0 bg-white rounded-full px-4 py-2 shadow-xl">
            <span className="text-blue-600 font-bold text-lg">24/7</span>
          </div>

          {/* Support icon */}
          <div className="absolute top-0 right-12 w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>
    </div>
  );
}
