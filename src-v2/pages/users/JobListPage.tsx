import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs";
import { Container, Box, Typography } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import Button from "../../components/common/Button";
import { JobPost } from "../../types/job.types";
import JobCard from "./JobCard";
import { setCurrentJob } from "../../redux/slices/jobsSlice";
import { useAppDispatch } from "../../redux/store";
import { useTranslation } from "react-i18next";

export const JobListPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { jobs, getFeaturedJobs, getCategoryJobs } = useJobs();
  const [categoryName] = useState<string>("");

  useEffect(() => {
    if (categoryId) {
      getCategoryJobs(categoryId);
      // You might want to fetch category name here
    } else {
      getFeaturedJobs();
    }
  }, [categoryId]);

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
            {categoryName
              ? t("jobList.jobsInCategory", { category: categoryName })
              : t("jobList.featuredJobs")}
          </Typography>
          <Button
            variant="outline"
            size="md"
            startIcon={<FilterList />}
            onClick={() => {}}
          >
            {t("jobList.filter")}
          </Button>
        </Box>

        <div className="space-y-4 py-4">
          {jobs.map((job: JobPost) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </Container>
    </div>
  );
};
