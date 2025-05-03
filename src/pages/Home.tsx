import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { Navigation } from "../components/Navigation";
import { ChatBot } from "../components/ChatBot";

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  // Mock featured jobs data
  const featuredJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $150k",
      posted: "2 days ago",
      logo: "https://ui-avatars.com/api/?name=TC&background=6366f1&color=fff",
    },
    {
      id: 2,
      title: "Product Manager",
      company: "InnovateLabs",
      location: "New York, NY",
      type: "Full-time",
      salary: "$130k - $160k",
      posted: "3 days ago",
      logo: "https://ui-avatars.com/api/?name=IL&background=06b6d4&color=fff",
    },
    {
      id: 3,
      title: "DevOps Engineer",
      company: "CloudTech Solutions",
      location: "Remote",
      type: "Full-time",
      salary: "$115k - $145k",
      posted: "1 day ago",
      logo: "https://ui-avatars.com/api/?name=CS&background=8b5cf6&color=fff",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-50 pt-16">
        {/* Hero Section */}
        <div className="bg-blue-900 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find Your Dream Job Today
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Connect with top employers and opportunities that match your
                skills and career goals
              </p>

              {/* Search Form */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <form className="flex flex-col md:flex-row gap-4">
                    <Input
                      placeholder="Job title or keywords"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      leftIcon={<Search className="h-5 w-5" />}
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                    />
                    <Input
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      leftIcon={<MapPin className="h-5 w-5" />}
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                    />
                    <Button
                      className="md:w-auto"
                      leftIcon={<Search className="h-5 w-5" />}
                    >
                      Search Jobs
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-blue-200">
                <span>Popular searches:</span>
                <Link
                  to="/search?q=software-engineer"
                  className="hover:text-white"
                >
                  Software Engineer
                </Link>
                <Link
                  to="/search?q=product-manager"
                  className="hover:text-white"
                >
                  Product Manager
                </Link>
                <Link
                  to="/search?q=data-scientist"
                  className="hover:text-white"
                >
                  Data Scientist
                </Link>
                <Link to="/search?q=ux-designer" className="hover:text-white">
                  UX Designer
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Jobs Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Featured Jobs
              </h2>
              <p className="text-slate-600 mt-1">
                Discover your next career opportunity
              </p>
            </div>
            <Button
              variant="outline"
              rightIcon={<Filter className="h-5 w-5" />}
            >
              Filter Jobs
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
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
                      <h3 className="text-lg font-semibold text-slate-900 truncate">
                        {job.title}
                      </h3>
                      <p className="text-slate-600">{job.company}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
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

                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="w-full group-hover:border-blue-500 group-hover:bg-blue-50"
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ChevronRight className="h-5 w-5" />}
            >
              View All Jobs
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-slate-100">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900">
                Why Choose JobBuilder
              </h2>
              <p className="text-slate-600 mt-2">
                Everything you need to find your next career opportunity
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card variant="bordered" className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Career Growth
                  </h3>
                  <p className="text-slate-600">
                    Access top companies and opportunities to advance your
                    career
                  </p>
                </CardContent>
              </Card>

              <Card variant="bordered" className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Professional Network
                  </h3>
                  <p className="text-slate-600">
                    Connect with industry professionals and expand your network
                  </p>
                </CardContent>
              </Card>

              <Card variant="bordered" className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Expert Resources
                  </h3>
                  <p className="text-slate-600">
                    Get resume tips, interview guides, and career advice
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </>
  );
};
