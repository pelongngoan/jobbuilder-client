import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../lib/api/services/jobs";
import { JobPost } from "../types/job";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building,
  Bookmark,
  Share2,
  ChevronLeft,
} from "lucide-react";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) throw new Error("No job ID provided");
        const res = await getJobById(id);
        setJob(res);
      } catch {
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!job) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
          className="mb-4"
        >
          Back to Search
        </Button>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <img
                src={String(
                  job.logoCompany ||
                    "https://ui-avatars.com/api/?name=J&background=6366f1&color=fff"
                )}
                alt={job.companyName}
                className="w-20 h-20 rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-600 mt-2">
                      <Building className="h-5 w-5" />
                      <span className="text-lg">{job.companyName}</span>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="flex items-center text-slate-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-base">{job.location}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span className="text-base">{job.jobType}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span className="text-base">{job.salaryRange}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-base">
                      {job.createdAt?.slice(0, 10)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-slate-500 text-sm">
                  Experience: {job.experienceLevel || "N/A"} | Salary Type:{" "}
                  {job.salaryType || "N/A"}
                </div>
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">
                    Job Description
                  </h2>
                  <p className="text-slate-700 whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
                {Array.isArray(job.benefits) && job.benefits.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Benefits</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.map((benefit, idx) => (
                        <span
                          key={String(benefit) + idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {String(benefit)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {Array.isArray(job.requirements) &&
                  job.requirements.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-lg font-semibold mb-2">
                        Requirements
                      </h2>
                      <ul className="list-disc list-inside text-slate-700">
                        {job.requirements.map((req, idx) => (
                          <li key={String(req) + idx}>{String(req)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                <div className="mt-8">
                  <Button variant="primary" size="lg">
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
