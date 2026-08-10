import axiosClient from "./axiosClient";


/*
 * Get all departments
 */
export const getDepartments = async () => {
  const response = await axiosClient.get(
    "/api/departments"
  );

  return response.data;
};


/*
 * Get department by ID
 */
export const getDepartmentById = async (id) => {
  const response = await axiosClient.get(
    `/api/departments/${id}`
  );

  return response.data;
};


/*
 * Create department
 */
export const createDepartment = async (
  departmentData
) => {
  const response = await axiosClient.post(
    "/api/departments",
    departmentData
  );

  return response.data;
};


/*
 * Update department
 */
export const updateDepartment = async (
  id,
  departmentData
) => {
  const response = await axiosClient.put(
    `/api/departments/${id}`,
    departmentData
  );

  return response.data;
};


/*
 * Delete department
 */
export const deleteDepartment = async (id) => {
  await axiosClient.delete(
    `/api/departments/${id}`
  );
};


/*
 * Get department statistics
 */
export const getDepartmentStatistics = async () => {
  const response = await axiosClient.get(
    "/api/departments/statistics"
  );

  return response.data;
};


/*
 * Get employees belonging to a department
 */
export const getEmployeesByDepartment = async (
  departmentId
) => {
  const response = await axiosClient.get(
    `/api/departments/${departmentId}/employees`
  );

  return response.data;
};