import { Outlet } from "react-router-dom";
import { SideMenu } from "../components/SideMenu";
import { MenuItem } from "../components/menuItem";

import {
  FileText,
  Briefcase,
  Settings,
  Users,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/management/dashboard",
  },
  {
    label: "HR Accounts",
    icon: <Users className="w-5 h-5" />,
    path: "/management/hr-management",
  },
  {
    label: "Job Posts",
    icon: <Briefcase className="w-5 h-5" />,
    path: "/management/jobpost-management",
  },
  {
    label: "Applications",
    icon: <FileText className="w-5 h-5" />,
    path: "/management/applications",
  },
  {
    label: "Messages",
    icon: <MessageSquare className="w-5 h-5" />,
    path: "/management/messages",
  },
  {
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    path: "/management/settings",
  },
];

export const ManagementLayout = () => {
  return (
    <div className="flex flex-row min-h-screen bg-gray-100">
      <SideMenu isOpen={true} menuItems={menuItems} />
      <div className="flex-1 p-4 bg-white shadow-md">
        <Outlet />
      </div>
    </div>
  );
};
