import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Menu, ChevronDown, LogOut, User } from 'lucide-react';

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/loginpage');
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30 animate-slideInUp">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Menu and Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
          >
            <Menu className="w-6 h-6 text-blue-600" />
          </button>

          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
            />
          </div>
        </div>

        {/* Right Section - User Profile */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold text-gray-800">
                  {user?.name || user?.username || 'User'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email || 'user@example.com'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 -translate-y-2">
              <div className="p-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:text-blue-600"
                >
                  <User className="w-4 h-4" />
                  Profile Settings
                </button>
                <div className="border-t border-gray-100 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
