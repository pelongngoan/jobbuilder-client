import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "../../lib/api/axios";

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  skills: string[];
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
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest.get("/jobs");
      return response.data;
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
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest.get(`/jobs/${id}`);
      return response.data;
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
  async (
    jobData: Omit<Job, "id" | "createdAt" | "updatedAt">,
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest.post("/jobs", jobData);
      return response.data;
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
    { id, jobData }: { id: string; jobData: Partial<Job> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest.put(`/jobs/${id}`, jobData);
      return response.data;
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
  async (id: string, { rejectWithValue }) => {
    try {
      await apiRequest.delete(`/jobs/${id}`);
      return id;
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
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.loading = false;
        state.jobs = action.payload;
      })
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
          (job) => job.id === action.payload.id
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.currentJob?.id === action.payload.id) {
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
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
        if (state.currentJob?.id === action.payload) {
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
