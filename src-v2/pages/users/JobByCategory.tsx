import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs";
import JobCard from "./JobCard";

const JobByCategory: React.FC = () => {
  const { categoryId } = useParams();
  const { jobs, getCategoryJobs } = useJobs();
  useEffect(() => {
    if (categoryId) {
      getCategoryJobs(categoryId);
    }
  }, [categoryId]);
  return (
    <>
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} onClick={() => {}} />
      ))}
    </>
  );
};

export default JobByCategory;
