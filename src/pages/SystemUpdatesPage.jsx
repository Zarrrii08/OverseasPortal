import React from "react";
import { Bell } from "lucide-react";

export default function SystemUpdatesPage() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <Bell className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            System Updates
          </h1>
          <p className="text-gray-500 text-lg mb-6">Coming Soon</p>
          <p className="text-gray-400 text-center max-w-md">
            This page is ready for API integration. Stay informed about system
            updates and announcements here.
          </p>
        </div>
      </div>
    </div>
  );
}
