import React from "react";
import { Link as LinkIcon } from "lucide-react";

export default function UsefulLinksPage() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <LinkIcon className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Useful Links & Training
          </h1>
          <p className="text-gray-500 text-lg mb-6">Coming Soon</p>
          <p className="text-gray-400 text-center max-w-md">
            This page is ready for API integration. You'll find helpful
            resources and training materials here.
          </p>
        </div>
      </div>
    </div>
  );
}
