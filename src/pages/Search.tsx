import { useState } from "react";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Filter,
  ChevronDown,
  ChevronRight,
  Building,
  Bookmark,
  Share2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { Navigation } from "../components/Navigation";

type FilterState = {
  jobType: string[];
  location: string[];
  experience: string[];
  salary: string[];
};

type FilterCategory = keyof FilterState;

const initialFilters: FilterState = {
  jobType: [],
  location: [],
  experience: [],
  salary: [],
};

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedFilters, setSelectedFilters] =
    useState<FilterState>(initialFilters);

  // Mock jobs data
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $150k",
      posted: "2 days ago",
      description:
        "We are seeking an experienced Frontend Developer to join our team...",
      logo: "https://ui-avatars.com/api/?name=TC&background=6366f1&color=fff",
      requirements: ["5+ years of experience", "React", "TypeScript", "CSS"],
    },
    {
      id: 2,
      title: "Product Manager",
      company: "InnovateLabs",
      location: "New York, NY",
      type: "Full-time",
      salary: "$130k - $160k",
      posted: "3 days ago",
      description:
        "Looking for a Product Manager to lead our product development...",
      logo: "https://ui-avatars.com/api/?name=IL&background=06b6d4&color=fff",
      requirements: [
        "4+ years of experience",
        "Agile",
        "Product Strategy",
        "Analytics",
      ],
    },
    {
      id: 3,
      title: "DevOps Engineer",
      company: "CloudTech Solutions",
      location: "Remote",
      type: "Full-time",
      salary: "$115k - $145k",
      posted: "1 day ago",
      description:
        "Join our DevOps team to build and maintain cloud infrastructure...",
      logo: "https://ui-avatars.com/api/?name=CS&background=8b5cf6&color=fff",
      requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    },
  ];

  // Filter options
  const filterOptions: Record<keyof FilterState, string[]> = {
    jobType: ["Full-time", "Part-time", "Contract", "Remote"],
    location: ["New York", "San Francisco", "London", "Remote"],
    experience: ["Entry Level", "Mid Level", "Senior Level", "Executive"],
    salary: ["$0-50k", "$50k-100k", "$100k-150k", "$150k+"],
  };

  const toggleFilter = (category: FilterCategory, value: string) => {
    setSelectedFilters((prev) => {
      const currentFilters = prev[category];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter((filter) => filter !== value)
        : [...currentFilters, value];

      return {
        ...prev,
        [category]: newFilters,
      } as FilterState;
    });
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Input
                placeholder="Location or 'Remote'"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Filters
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Clear all
                    </Button>
                  </div>

                  {/* Filter Sections */}
                  {Object.entries(filterOptions).map(([category, options]) => (
                    <div key={category} className="mb-6">
                      <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center justify-between">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                        <ChevronDown className="h-4 w-4" />
                      </h3>
                      <div className="space-y-2">
                        {options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-900"
                          >
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              checked={selectedFilters[
                                category as FilterCategory
                              ].includes(option)}
                              onChange={() =>
                                toggleFilter(category as FilterCategory, option)
                              }
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-600">
                  Showing <span className="font-medium">{jobs.length}</span>{" "}
                  results
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Filter className="h-4 w-4" />}
                >
                  Sort by: Newest
                </Button>
              </div>

              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    variant="bordered"
                    className="group hover:border-blue-500"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-12 h-12 rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">
                                {job.title}
                              </h3>
                              <div className="flex items-center gap-2 text-slate-600 mt-1">
                                <Building className="h-4 w-4" />
                                <span>{job.company}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-600 hover:text-blue-600"
                                leftIcon={<Bookmark className="h-4 w-4" />}
                              >
                                Save
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-600 hover:text-blue-600"
                                leftIcon={<Share2 className="h-4 w-4" />}
                              >
                                Share
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="flex items-center text-slate-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span className="text-sm">{job.location}</span>
                            </div>
                            <div className="flex items-center text-slate-600">
                              <Briefcase className="h-4 w-4 mr-2" />
                              <span className="text-sm">{job.type}</span>
                            </div>
                            <div className="flex items-center text-slate-600">
                              <DollarSign className="h-4 w-4 mr-2" />
                              <span className="text-sm">{job.salary}</span>
                            </div>
                            <div className="flex items-center text-slate-600">
                              <Clock className="h-4 w-4 mr-2" />
                              <span className="text-sm">{job.posted}</span>
                            </div>
                          </div>

                          <p className="text-slate-600 mt-4 line-clamp-2">
                            {job.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {job.requirements.map((req) => (
                              <span
                                key={req}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {req}
                              </span>
                            ))}
                          </div>

                          <div className="mt-4">
                            <Button
                              variant="outline"
                              className="group-hover:border-blue-500 group-hover:bg-blue-50"
                              rightIcon={<ChevronRight className="h-4 w-4" />}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="mt-6 text-center">
                <Button variant="outline" size="lg">
                  Load More Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
