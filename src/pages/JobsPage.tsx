import React, { useState } from "react";
import { JobCard } from "../components/JobCard";
import { useNavigate } from "react-router-dom";

// Mock job data
const jobs = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Tech Solutions",
    location: "Hanoi, Vietnam",
    type: "Full-time",
    salary: "$1200 - $1500",
    postedDate: "2 days ago",
    description: "Join our frontend team to build modern web apps.",
    logo: undefined,
  },
  {
    id: "2",
    title: "Backend Developer",
    company: "Innovatech",
    location: "Ho Chi Minh City, Vietnam",
    type: "Part-time",
    salary: "$900 - $1200",
    postedDate: "1 day ago",
    description: "Work on scalable backend services.",
    logo: undefined,
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "Creative Minds",
    location: "Da Nang, Vietnam",
    type: "Remote",
    salary: "$1000 - $1300",
    postedDate: "3 days ago",
    description: "Design user-centric interfaces for our products.",
    logo: undefined,
  },
];

const JobsPage: React.FC = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleJobClick = (id: string) => {
    setSelectedJobId(id);
    navigate("job-detail", { state: { jobId: id } });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Latest Jobs</h1>
      <div>
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => handleJobClick(job.id)}
            className={`cursor-pointer transition-shadow rounded-lg ${
              selectedJobId === job.id ? "ring-2 ring-accent" : ""
            }`}
          >
            <JobCard {...job} id={job.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
