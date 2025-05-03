import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Search,
  FileText,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "./ui/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const notifications = [
    {
      id: 1,
      title: "New job match",
      message: "We found a new job that matches your profile",
      time: "5m ago",
    },
    {
      id: 2,
      title: "Application viewed",
      message: "Your application was viewed by TechCorp Inc.",
      time: "2h ago",
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">JobBuilder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/search"
              className="text-slate-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <Search className="h-4 w-4" />
              <span>Find Jobs</span>
            </Link>
            <Link
              to="/resumes"
              className="text-slate-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <FileText className="h-4 w-4" />
              <span>My Resumes</span>
            </Link>
          </div>

          {/* Desktop Right Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-slate-600 hover:text-blue-600 rounded-full hover:bg-slate-100"
              >
                <Bell className="h-5 w-5" />
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                  <div className="px-4 py-2 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900">
                      Notifications
                    </h3>
                  </div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="text-sm font-medium text-slate-900">
                        {notification.title}
                      </div>
                      <div className="text-sm text-slate-600">
                        {notification.message}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {notification.time}
                      </div>
                    </div>
                  ))}
                  <div className="px-4 py-2 border-t border-slate-200">
                    <Link
                      to="/notifications"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600"
              >
                <img
                  src="https://ui-avatars.com/api/?name=John+Doe&background=c7d2fe&color=3730a3"
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  <button
                    // onClick={() => dispatch(logoutUser())}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            <Link to="/post-job">
              <Button size="sm">Post a Job</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/search"
              className="flex items-center space-x-2 text-slate-600 hover:text-blue-600"
            >
              <Search className="h-5 w-5" />
              <span>Find Jobs</span>
            </Link>
            <Link
              to="/resumes"
              className="flex items-center space-x-2 text-slate-600 hover:text-blue-600"
            >
              <FileText className="h-5 w-5" />
              <span>My Resumes</span>
            </Link>
            <hr className="border-slate-200" />
            <Button className="w-full">Post a Job</Button>
          </div>
        </div>
      )}
    </nav>
  );
};
