import { Card, CardContent } from "../../components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Job } from "../../shared/schema";
import { Link } from "wouter";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function RightSidebar() {
  const { data: jobs } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  // Get the first 3 jobs for recommendations
  const recommendedJobs = jobs?.slice(0, 3) || [];

  return (
    <div className="lg:w-1/4 space-y-6">
      {/* Job Recommendations */}
      <Card>
        <CardContent className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-secondary">
            Recommended Jobs
          </h3>
          <div className="mt-4 space-y-4">
            {recommendedJobs.length > 0 ? (
              recommendedJobs.map((job) => (
                <div
                  key={job.id}
                  className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                >
                  <h4 className="font-medium text-primary">{job.title}</h4>
                  <p className="text-sm text-secondary">{job.companyId}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>
                      Posted{" "}
                      {formatDistanceToNow(new Date(job.postedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No job recommendations available yet.
              </p>
            )}
            <Link
              href="/jobs"
              className="block text-center text-primary hover:underline"
            >
              View all jobs
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Skills & Learning */}
      <Card>
        <CardContent className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-secondary">
            Enhance Your Skills
          </h3>
          <div className="mt-4 space-y-3">
            <a
              href="#"
              className="block p-3 border border-gray-200 rounded hover:bg-[#f3f2ef] transition"
            >
              <h4 className="font-medium text-primary">
                React Advanced Patterns
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Learn advanced React techniques to boost your career
              </p>
            </a>
            <a
              href="#"
              className="block p-3 border border-gray-200 rounded hover:bg-[#f3f2ef] transition"
            >
              <h4 className="font-medium text-primary">
                Resume Writing Masterclass
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Stand out with a professionally crafted resume
              </p>
            </a>
            <a
              href="#"
              className="block p-3 border border-gray-200 rounded hover:bg-[#f3f2ef] transition"
            >
              <h4 className="font-medium text-primary">Modern JavaScript</h4>
              <p className="text-xs text-gray-500 mt-1">
                Master the latest JavaScript features and practices
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
