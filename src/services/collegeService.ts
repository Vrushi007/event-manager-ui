import axiosInstance from "../utils/axios";
import { College, CollegeFormData } from "../types";

export const collegeService = {
  async getAllColleges(
    skip: number = 0,
    limit: number = 100,
    activeOnly: boolean = false
  ): Promise<College[]> {
    const params = new URLSearchParams();
    params.append("skip", skip.toString());
    params.append("limit", limit.toString());
    if (activeOnly) {
      params.append("active_only", "true");
    }
    const response = await axiosInstance.get<College[]>(
      `/api/colleges?${params.toString()}`
    );
    return response.data;
  },

  async getCollegeById(id: number): Promise<College> {
    const response = await axiosInstance.get<College>(`/api/colleges/${id}`);
    return response.data;
  },

  async createCollege(data: CollegeFormData): Promise<College> {
    const response = await axiosInstance.post<College>("/api/colleges", data);
    return response.data;
  },

  async updateCollege(id: number, data: CollegeFormData): Promise<College> {
    const response = await axiosInstance.put<College>(
      `/api/colleges/${id}`,
      data
    );
    return response.data;
  },

  async deleteCollege(id: number): Promise<void> {
    await axiosInstance.delete(`/api/colleges/${id}`);
  },
};
