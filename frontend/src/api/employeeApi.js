import axiosClient from "./axiosClient";


/*
 * =========================================
 * GET EMPLOYEES
 * ADMIN + HR
 * =========================================
 */

export const getEmployees = async ({
  search = "",
  page = 0,
  size = 10,
  sortBy = "id",
  direction = "asc",
} = {}) => {

  const response = await axiosClient.get(
    "/api/employees/search",
    {
      params: {
        search: search || undefined,
        page,
        size,
        sortBy,
        direction,
      },
    }
  );

  return response.data;
};


/*
 * =========================================
 * GET RECENT EMPLOYEES
 * ADMIN + HR
 * =========================================
 */

export const getRecentEmployees = async () => {

  const response = await axiosClient.get(
    "/api/employees/recent"
  );

  return response.data;
};


/*
 * =========================================
 * GET CURRENT LOGGED-IN EMPLOYEE
 * EMPLOYEE ONLY
 * =========================================
 */

export const getCurrentEmployee = async () => {

  const response = await axiosClient.get(
    "/api/employees/me"
  );

  return response.data;
};


/*
 * =========================================
 * GET EMPLOYEE BY ID
 * ADMIN + HR
 * =========================================
 */

export const getEmployeeById = async (id) => {

  const response = await axiosClient.get(
    `/api/employees/${id}`
  );

  return response.data;
};


/*
 * =========================================
 * CREATE EMPLOYEE
 * ADMIN + HR
 *
 * Also creates the EMPLOYEE user account.
 * =========================================
 */

export const createEmployee = async (
  employeeData
) => {

  const response = await axiosClient.post(
    "/api/employees",
    employeeData
  );

  return response.data;
};


/*
 * =========================================
 * UPDATE EMPLOYEE
 * ADMIN + HR
 * =========================================
 */

export const updateEmployee = async (
  id,
  employeeData
) => {

  const response = await axiosClient.put(
    `/api/employees/${id}`,
    employeeData
  );

  return response.data;
};


/*
 * =========================================
 * DELETE EMPLOYEE
 * ADMIN ONLY
 *
 * Also deletes linked EMPLOYEE user account.
 * =========================================
 */

export const deleteEmployee = async (id) => {

  await axiosClient.delete(
    `/api/employees/${id}`
  );
};