import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardIcon,
  UsersIcon,
  JobsIcon,
  ApplicationsIcon,
  CategoriesIcon,
  TeamIcon,
  LogoutIcon,
} from "./SidebarIcons";
import useAuth from "../../hooks/useAuth";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface VisibleTo {
  admin: boolean;
  company: boolean;
  staff: boolean;
  all: boolean;
}

export interface SidebarItem {
  to: string;
  label: string;
  icon: ReactNode;
  visibleTo?: VisibleTo;
  visible?: boolean;
}

interface SidebarProps {
  title?: string;
  isOpen: boolean;
  onToggle: () => void;
  activeColor?: string;
  hoverColor?: string;
  userRole?: "admin" | "company" | "staff" | string;
}

const Sidebar: React.FC<SidebarProps> = ({
  title = "Dashboard",
  isOpen = true,
  onToggle,
  activeColor = "bg-blue-700",
  hoverColor = "hover:bg-gray-700",
}) => {
  const location = useLocation();
  const { role } = useAuth();
  const dispatch = useDispatch();

  // Check if the current path matches the link
  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  // Define sections with items
  const sections: SidebarSection[] = [
    {
      title: "Main",
      items: [
        {
          to: "/manager/dashboard",
          label: "Dashboard",
          icon: <DashboardIcon />,
          visible: true,
          visibleTo: {
            admin: true,
            company: true,
            staff: true,
            all: true,
          },
        },
        {
          to: "/manager/profile",
          label: "Profile",
          icon: <UsersIcon />,
          visible: true,
          visibleTo: {
            admin: false,
            company: true,
            staff: true,
            all: false,
          },
        },
        {
          to: "/manager/staffs",
          label: "Staffs",
          icon: <TeamIcon />,
          visibleTo: {
            admin: false,
            company: true,
            staff: false,
            all: false,
          },
          visible: true,
        },
        {
          to: "/manager/users",
          label: "Users",
          icon: <UsersIcon />,
          visibleTo: {
            admin: true,
            company: false,
            staff: false,
            all: false,
          },
          visible: true,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          to: "/manager/jobs",
          label: "Jobs",
          icon: <JobsIcon />,
          visibleTo: {
            admin: false,
            company: true,
            staff: true,
            all: false,
          },
          visible: true,
        },
        {
          to: "/manager/applications",
          label: "Applications",
          icon: <ApplicationsIcon />,
          visible: true,
          visibleTo: {
            admin: false,
            company: true,
            staff: true,
            all: false,
          },
        },
        {
          to: "/manager/categories",
          label: "Categories",
          icon: <CategoriesIcon />,
          visible: true,
          visibleTo: {
            admin: true,
            company: false,
            staff: false,
            all: false,
          },
        },
        {
          to: "/manager/chat",
          label: "Chat",
          icon: <CategoriesIcon />,
          visible: true,
          visibleTo: {
            admin: false,
            company: false,
            staff: true,
            all: true,
          },
        },
        {
          to: "/manager/login",
          label: "Logout",
          icon: <LogoutIcon />,
          visible: true,
          visibleTo: {
            admin: true,
            company: true,
            staff: true,
            all: true,
          },
        },
      ],
    },
  ];

  return (
    <aside
      className={`bg-gray-800 text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } fixed left-0 h-full z-10 pt-4 shadow-lg overflow-y-auto`}
    >
      <div className="px-4 py-2 flex justify-between items-center">
        <h2 className={`text-lg font-semibold ${isOpen ? "block" : "hidden"}`}>
          {title}
        </h2>
        <button
          onClick={onToggle}
          className="text-white p-1 rounded-md hover:bg-gray-700"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>

      <nav className="mt-6">
        <ul className="space-y-1 px-2">
          {sections.map((section, sectionIndex) => (
            <React.Fragment key={`section-${sectionIndex}`}>
              {/* Section header (only shown when sidebar is open) */}
              {isOpen && section.title && (
                <li className="mt-6 mb-2">
                  <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </span>
                </li>
              )}

              {/* Section items */}
              {section.items
                .filter((item) => {
                  if (item.visibleTo) {
                    return item.visibleTo[role as keyof VisibleTo];
                  }
                  return true;
                })
                .map((item, itemIndex) => (
                  <li key={`item-${sectionIndex}-${itemIndex}`}>
                    <Link
                      to={item.to}
                      onClick={() => {
                        if (item.to === "/manager/login") {
                          dispatch(logout());
                        }
                      }}
                      className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                        isActive(item.to) ? activeColor : hoverColor
                      }`}
                    >
                      <span className="h-5 w-5 mr-3">{item.icon}</span>
                      <span className={`${isOpen ? "block" : "hidden"}`}>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
            </React.Fragment>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
