import { Link, useLocation } from "react-router-dom";

import clsx from "clsx";
import { MenuItem } from "./menuItem";

interface SideMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
}
export const SideMenu = ({ menuItems }: SideMenuProps) => {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-8 text-blue-600">Management</h2>
      <nav>
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-lg transition-all",
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
