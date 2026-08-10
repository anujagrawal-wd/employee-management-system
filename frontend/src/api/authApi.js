import axiosClient from "./axiosClient";


export const changePassword = async ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {

  const response =
    await axiosClient.put(
      "/api/auth/change-password",
      {
        currentPassword,
        newPassword,
        confirmPassword,
      }
    );

  return response.data;
};