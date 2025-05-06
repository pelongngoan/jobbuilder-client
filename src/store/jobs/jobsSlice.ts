import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as jobService from "../../lib/api/services/jobs";
import { JobPost } from "../../types/job";
import { PaginatedResponse } from "../../types/api";

enum JobType {
  FullTime = "full-time",
  PartTime = "part-time",
  Contract = "contract",
  Internship = "internship",
  Remote = "remote",
}

enum SalaryType {
  Hourly = "hourly",
  Monthly = "monthly",
  Yearly = "yearly",
}

enum Status {
  Open = "open",
  Closed = "closed",
}

interface JobOther {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

interface Job {
  _id: string;
  companyId: string;
  hrId: string;
  title: string;
  location: string;
  jobType: JobType;
  salaryRange?: string;
  salaryCurrency: string;
  salaryType?: SalaryType;
  description: string;
  keyResponsibilities?: string[];
  benefits?: string[];
  category?: string;
  status?: Status;
  deadline?: string;
  requirements?: string[];
  contactEmail?: string;
  contactPhone?: string;
  logoCompany?: string;
  companyName?: string;
  companyWebsite?: string;
  applications: string[];
  other?: JobOther;
  createdAt: string;
  updatedAt: string;
}

interface JobsState {
  jobs: Job[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchJobs = createAsyncThunk(
  "job/",
  async (
    params: {
      page?: number;
      limit?: number;
      title?: string;
      location?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await jobService.getAllJobs(params);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch jobs");
    }
  }
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (_id: string, { rejectWithValue }) => {
    try {
      const data = await jobService.getJobById(_id);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch job");
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData: JobPost, { rejectWithValue }) => {
    try {
      const data = await jobService.createJob(jobData);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to create job");
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (
    { _id, jobData }: { _id: string; jobData: Partial<JobPost> },
    { rejectWithValue }
  ) => {
    try {
      const data = await jobService.updateJob(_id, jobData);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update job");
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (_id: string, { rejectWithValue }) => {
    try {
      await jobService.deleteJob(_id);
      return _id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to delete job");
    }
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchJobs.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<JobPost>>) => {
          state.loading = false;
          console.log(action.payload);
          state.jobs = action.payload.data.map((jobPost) => ({
            _id: jobPost._id,
            companyId: jobPost.companyId?.toString() ?? "",
            hrId: jobPost.hrId?.toString() ?? "",
            title: jobPost.title,
            location: jobPost.location,
            jobType: Object.values(JobType).includes(jobPost.jobType as JobType)
              ? (jobPost.jobType as JobType)
              : JobType.FullTime,
            salaryRange: jobPost.salaryRange ?? "",
            salaryCurrency: jobPost.salaryCurrency ?? "",
            salaryType: Object.values(SalaryType).includes(
              jobPost.salaryType as SalaryType
            )
              ? (jobPost.salaryType as SalaryType)
              : SalaryType.Monthly,
            description: jobPost.description,
            keyResponsibilities: jobPost.keyResponsibilities ?? [],
            benefits: jobPost.benefits ?? [],
            category: jobPost.category ?? "",
            status: Object.values(Status).includes(jobPost.status as Status)
              ? (jobPost.status as Status)
              : Status.Open,
            deadline: jobPost.deadline ? jobPost.deadline.toString() : "",
            requirements: jobPost.requirements ?? [],
            contactEmail:
              typeof jobPost.contactEmail === "string"
                ? jobPost.contactEmail
                : "",
            contactPhone:
              typeof jobPost.contactPhone === "string"
                ? jobPost.contactPhone
                : "",
            logoCompany:
              typeof jobPost.logoCompany === "string"
                ? jobPost.logoCompany
                : "",
            companyName: jobPost.companyName ?? "",
            companyWebsite:
              typeof jobPost.companyWebsite === "string"
                ? jobPost.companyWebsite
                : "",
            applications: jobPost.applications?.map(String) ?? [],
            other: (jobPost.other as JobOther) ?? undefined,
            createdAt: jobPost.createdAt?.toString() ?? "",
            updatedAt:
              jobPost.updatedAt?.toString() ??
              jobPost.createdAt?.toString() ??
              "",
          }));
        }
      )
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading = false;
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload._id
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.currentJob?._id === action.payload._id) {
          state.currentJob = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
        if (state.currentJob?._id === action.payload) {
          state.currentJob = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentJob } = jobsSlice.actions;
export default jobsSlice.reducer;
