import React from "react";
import { Card, Input, Select, Button } from "../../../components/common";

interface JobFiltersProps {
  filters: {
    search: string;
    location: string;
    jobType: string;
    salary: string;
    datePosted: string;
    experience: string;
  };
  onChange: (name: string, value: string) => void;
  onReset: () => void;
  onSubmit: () => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onChange,
  onReset,
  onSubmit,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const jobTypeOptions = [
    { value: "", label: "All Types" },
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Contract", label: "Contract" },
    { value: "Temporary", label: "Temporary" },
    { value: "Internship", label: "Internship" },
    { value: "Remote", label: "Remote" },
  ];

  const salaryOptions = [
    { value: "", label: "Any Salary" },
    { value: "0-30000", label: "Up to $30,000" },
    { value: "30000-50000", label: "Up to $50,000" },
    { value: "50000-80000", label: "Up to $80,000" },
    { value: "80000-100000", label: "Up to $100,000" },
    { value: "100000+", label: "$100,000+" },
  ];

  const datePostedOptions = [
    { value: "", label: "Any Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "Past Week" },
    { value: "month", label: "Past Month" },
  ];

  const experienceOptions = [
    { value: "", label: "Any Experience" },
    { value: "entry", label: "Entry Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
    { value: "executive", label: "Executive Level" },
  ];

  return (
    <Card variant="outlined" className="mb-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="search"
            label="Search"
            placeholder="Job title, company or keywords"
            value={filters.search}
            onChange={handleChange}
            fullWidth
          />

          <Input
            name="location"
            label="Location"
            placeholder="City, state, or country"
            value={filters.location}
            onChange={handleChange}
            fullWidth
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            name="jobType"
            label="Job Type"
            options={jobTypeOptions}
            value={filters.jobType}
            onChange={handleChange}
            fullWidth
          />

          <Select
            name="salary"
            label="Salary Range"
            options={salaryOptions}
            value={filters.salary}
            onChange={handleChange}
            fullWidth
          />

          <Select
            name="datePosted"
            label="Date Posted"
            options={datePostedOptions}
            value={filters.datePosted}
            onChange={handleChange}
            fullWidth
          />

          <Select
            name="experience"
            label="Experience Level"
            options={experienceOptions}
            value={filters.experience}
            onChange={handleChange}
            fullWidth
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={onReset}>
            Reset Filters
          </Button>

          <Button variant="primary" onClick={onSubmit}>
            Apply Filters
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JobFilters;
