import axiosClient from "./axiosClient";

export const getDashboardStatistics = async () => {
  const response = await axiosClient.get(
    "/api/dashboard/statistics"
  );

  return response.data;
};