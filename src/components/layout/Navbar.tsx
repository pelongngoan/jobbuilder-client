import { Link, useLocation } from "wouter";
import { useAuth } from "../../context/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { Search, Bell, Mail, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "../../components/ui/sheet";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/jobs", label: "Jobs" },
    { path: "/resume", label: "Resumes" },
    { path: "/company", label: "Companies" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <h1 className="text-primary text-2xl font-bold cursor-pointer">
                  JobConnect
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden sm:ml-6 sm:flex sm:space-x-8"
              aria-label="Main Navigation"
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`${
                    location === item.path
                      ? "border-primary text-primary"
                      : "border-transparent text-secondary hover:text-primary"
                  } px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <div className="relative">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Search"
                  className="w-64 rounded-l-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="default" className="rounded-l-none">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <Mail className="h-5 w-5" />
            </Button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={
                      user?.profilePicture ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    }
                    alt={user?.name || "User profile"}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    Your Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="pt-6 pb-3 space-y-1">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.path}>
                      <Link
                        href={item.path}
                        className={`${
                          location === item.path
                            ? "bg-primary text-white"
                            : "text-secondary hover:bg-neutral-dark hover:text-primary"
                        } block pl-3 pr-4 py-2 text-base font-medium`}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={
                          user?.profilePicture ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        }
                        alt={user?.name || "User profile"}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-secondary">
                        {user?.name || user?.username}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <SheetClose asChild>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-base font-medium text-secondary hover:bg-neutral-dark hover:text-primary"
                      >
                        Your Profile
                      </Link>
                    </SheetClose>
                    <a
                      href="#"
                      className="block px-4 py-2 text-base font-medium text-secondary hover:bg-neutral-dark hover:text-primary"
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="block px-4 py-2 text-base font-medium text-secondary hover:bg-neutral-dark hover:text-primary"
                    >
                      Sign out
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
