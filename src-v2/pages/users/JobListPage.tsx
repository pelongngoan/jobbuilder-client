import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs";
import { Container, Box, Typography } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import Button from "../../components/common/Button";
import { JobPost } from "../../types/job.types";
import JobCard from "./JobCard";
import { setCurrentJob } from "../../redux/slices/jobsSlice";
import { useAppDispatch } from "../../redux/store";
export const JobListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { jobs, getFeaturedJobs, getCategoryJobs } = useJobs();

  useEffect(() => {
    getFeaturedJobs();
  }, []);

  const handleSearch = (query: string, location: string) => {
    const searchParams = new URLSearchParams();
    if (query) searchParams.append("q", query);
    if (location) searchParams.append("location", location);
    navigate(`/jobs/search?${searchParams.toString()}`);
  };

  const handleJobClick = (jobId: string) => {
    dispatch(setCurrentJob(jobId));
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container maxWidth="lg">
        <Box
          sx={{
            pt: 6,
            pb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1">
            {categoryName ? `Jobs in ${categoryName}` : "Featured Jobs"}
          </Typography>
          <Button
            variant="outline"
            size="md"
            startIcon={<FilterList />}
            onClick={() => {}}
          >
            Filter
          </Button>
        </Box>

        <div className="space-y-4 py-4">
          {jobs.map((job: JobPost) => (
            <JobCard key={job._id} job={job} onClick={handleJobClick} />
          ))}
        </div>
      </Container>
    </div>
  );
};
