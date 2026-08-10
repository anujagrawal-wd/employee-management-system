import axiosClient from "./axiosClient";


export const getAllUsers = async () => {

  const response =
    await axiosClient.get(
      "/api/auth/admin/users"
    );

  return response.data;
};


export const createUser = async (userData) => {

  const response =
    await axiosClient.post(
      "/api/auth/admin/create-user",
      userData
    );

  return response.data;
};


export const updateUserStatus = async (
  userId,
  enabled
) => {

  const response =
    await axiosClient.put(
      `/api/auth/admin/users/${userId}/status`,
      null,
      {
        params: {
          enabled,
        },
      }
    );

  return response.data;
};