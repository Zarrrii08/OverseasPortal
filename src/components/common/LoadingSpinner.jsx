import React from 'react';

export default function LoadingSpinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            {/* Inner pulsing circle */}
            <div className="absolute inset-2 bg-blue-100 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-600 font-medium animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        <div className="absolute inset-2 bg-blue-100 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
