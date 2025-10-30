import React from "react";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import BookingCard from "../components/dashboard/BookingCard";
import { FileText, Phone, Video, Dna } from "lucide-react";

export default function DashboardPage() {
  // Mock data - replace with API integration later
  const bookingStats = [
    {
      title: "F2F Bookings",
      count: 180,
      description: "F2F bookings completed.",
      icon: FileText,
      color: "blue",
    },
    {
      title: "STEL Bookings",
      count: 2,
      description: "STEL bookings completed.",
      icon: Phone,
      color: "cyan",
    },
    {
      title: "Video Bookings",
      count: 0,
      description: "Video bookings completed.",
      icon: Video,
      color: "purple",
    },
    {
      title: "DNA Bookings",
      count: 0,
      description: "Total DNA Bookings.",
      icon: Dna,
      color: "teal",
    },
  ];

  return (
    <div className="p-6">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Booking Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bookingStats.map((stat, index) => (
          <BookingCard
            key={index}
            title={stat.title}
            count={stat.count}
            description={stat.description}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>

      {/* Additional Content Area - Ready for API Integration */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-500">
          This section is ready for API integration. You can display recent
          bookings, notifications, or other relevant data here.
        </p>
      </div>
    </div>
  );
}
