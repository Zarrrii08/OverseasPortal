import React from 'react';
import { FileText } from 'lucide-react';

export default function BookingCard({ title, count, description, icon: Icon = FileText, color = 'blue', index = 0 }) {
  const colorClasses = {
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    cyan: 'from-cyan-400 to-cyan-600',
    teal: 'from-teal-400 to-teal-600',
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-slideInUp group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-gray-600 text-sm font-medium mb-2 group-hover:text-gray-800 transition-colors">{title}</h3>
          <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">{count}</div>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
}
