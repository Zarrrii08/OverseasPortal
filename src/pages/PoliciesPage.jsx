import React from "react";
import { FileText } from "lucide-react";

export default function PoliciesPage() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-12 h-12 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Policies & Procedure
          </h1>
          <p className="text-gray-500 text-lg mb-6">Coming Soon</p>
          <p className="text-gray-400 text-center max-w-md">
            This page is ready for API integration. View company policies and
            procedures here.
          </p>
        </div>
      </div>
    </div>
  );
}
