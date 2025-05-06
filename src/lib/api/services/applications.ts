import axios from "axios";
import { Application } from "../../../types/application";

const API_URL = "/api/applications";

export const fetchApplications = async (): Promise<Application[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const updateApplicationStatus = async (
  id: string,
  status: string
): Promise<Application> => {
  const res = await axios.put(`${API_URL}/${id}/status`, { status });
  return res.data.updatedApplication;
};
