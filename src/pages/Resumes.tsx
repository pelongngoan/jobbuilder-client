import { useState } from "react";
import {
  Plus,
  FileText,
  Download,
  Edit,
  Trash2,
  Eye,
  Upload,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Navigation } from "../components/Navigation";
import { Link } from "react-router-dom";

export const Resumes = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock resumes data
  const resumes = [
    {
      id: 1,
      title: "Software Developer Resume",
      lastUpdated: "2 days ago",
      thumbnail:
        "https://ui-avatars.com/api/?name=SD&background=6366f1&color=fff",
      status: "Active",
    },
    {
      id: 2,
      title: "Frontend Developer CV",
      lastUpdated: "1 week ago",
      thumbnail:
        "https://ui-avatars.com/api/?name=FD&background=06b6d4&color=fff",
      status: "Active",
    },
    {
      id: 3,
      title: "Full Stack Engineer Resume",
      lastUpdated: "2 weeks ago",
      thumbnail:
        "https://ui-avatars.com/api/?name=FS&background=8b5cf6&color=fff",
      status: "Draft",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
              <p className="text-slate-600 mt-1">
                Create and manage your professional resumes
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                leftIcon={<Upload className="h-4 w-4" />}
              >
                Import Resume
              </Button>
              <Link to="/create-resume">
                <Button leftIcon={<Plus className="h-4 w-4" />}>
                  Create New Resume
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <Input
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Resumes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card
                key={resume.id}
                variant="bordered"
                className="group hover:border-blue-500"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={resume.thumbnail}
                        alt={resume.title}
                        className="w-16 h-20 rounded-lg object-cover bg-slate-100"
                      />
                      <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-400 w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 truncate">
                          {resume.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            resume.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {resume.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        Last updated {resume.lastUpdated}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      leftIcon={<Eye className="h-4 w-4" />}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      leftIcon={<Edit className="h-4 w-4" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      leftIcon={<Download className="h-4 w-4" />}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:border-red-600"
                      leftIcon={<Trash2 className="h-4 w-4" />}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {resumes.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No resumes yet
                </h3>
                <p className="text-slate-600 mb-6">
                  Create your first resume to start applying for jobs
                </p>
                <Button leftIcon={<Plus className="h-4 w-4" />}>
                  Create New Resume
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};
