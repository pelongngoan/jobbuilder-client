import apiClient from "./api";
import { Skill, SkillRequest, GroupedSkills } from "../types";
import { ApiResponse } from "../types/common.types";

// Skill service
const skillService = {
  // Get all skills
  getSkills: async () => {
    const response = await apiClient.get<ApiResponse<Skill[]>>("/skills");
    return response.data;
  },

  // Get skill by ID
  getSkillById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Skill>>(`/skills/${id}`);
    return response.data;
  },

  // Create new skill
  createSkill: async (skillData: SkillRequest) => {
    const response = await apiClient.post<ApiResponse<Skill>>(
      "/skills",
      skillData
    );
    return response.data;
  },

  // Update skill
  updateSkill: async (id: string, skillData: Partial<SkillRequest>) => {
    const response = await apiClient.put<ApiResponse<Skill>>(
      `/skills/${id}`,
      skillData
    );
    return response.data;
  },

  // Delete skill
  deleteSkill: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/skills/${id}`
    );
    return response.data;
  },

  // Get skills grouped by category
  getSkillsByCategory: async () => {
    const response = await apiClient.get<ApiResponse<GroupedSkills[]>>(
      "/skills/by-category"
    );
    return response.data;
  },

  // Search skills by name
  searchSkills: async (query: string) => {
    const response = await apiClient.get<ApiResponse<Skill[]>>(
      "/skills/search",
      {
        params: { query },
      }
    );
    return response.data;
  },

  // Get popular skills
  getPopularSkills: async (limit: number = 10) => {
    const response = await apiClient.get<ApiResponse<Skill[]>>(
      "/skills/popular",
      {
        params: { limit },
      }
    );
    return response.data;
  },
};

export default skillService;
