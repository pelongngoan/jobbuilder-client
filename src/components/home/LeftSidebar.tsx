import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useAuth } from "../../context/useAuth";
import { Link } from "wouter";
import { Bookmark, FileText, Briefcase, Users, Building } from "lucide-react";

export default function LeftSidebar() {
  const { user } = useAuth();

  return (
    <div className="lg:w-1/4 space-y-6">
      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-20 bg-primary"></div>
        <CardContent className="px-4 py-5 sm:px-6 -mt-10 flex flex-col items-center">
          <img
            className="h-24 w-24 rounded-full border-4 border-white"
            src={
              user?.profilePicture ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            }
            alt={user?.name || "User profile"}
          />
          <h3 className="mt-2 text-lg font-medium text-secondary">
            {user?.name || user?.username}
          </h3>
          <p className="text-sm text-gray-500">
            {user?.headline || "Add a headline"}
          </p>
          <div className="mt-3 w-full border-t border-gray-200 pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Profile views</span>
              <span className="font-medium text-primary">237</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Post impressions</span>
              <span className="font-medium text-primary">859</span>
            </div>
          </div>
          <Link to="/profile">
            <Button className="mt-4 w-full">View full profile</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardContent className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-secondary">Quick Links</h3>
          <div className="mt-4 space-y-3">
            <Link to="/jobs">
              <a className="flex items-center text-primary hover:underline">
                <Bookmark className="mr-2 h-4 w-4" />
                <span>My saved jobs</span>
              </a>
            </Link>
            <Link to="/resume">
              <a className="flex items-center text-primary hover:underline">
                <FileText className="mr-2 h-4 w-4" />
                <span>My resumes</span>
              </a>
            </Link>
            <Link to="/jobs">
              <a className="flex items-center text-primary hover:underline">
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Job applications</span>
              </a>
            </Link>
            <a
              href="#"
              className="flex items-center text-primary hover:underline"
            >
              <Users className="mr-2 h-4 w-4" />
              <span>My network</span>
            </a>
            <Link to="/company">
              <a className="flex items-center text-primary hover:underline">
                <Building className="mr-2 h-4 w-4" />
                <span>Companies I follow</span>
              </a>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
