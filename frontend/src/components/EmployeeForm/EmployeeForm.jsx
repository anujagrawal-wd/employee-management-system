import { useEffect, useState } from "react";

import {
  createEmployee,
  updateEmployee,
  getEmployeeById,
} from "../../api/employeeApi";

import { getDepartments } from "../../api/departmentApi";


function EmployeeForm({
  employeeId = null,
  onClose,
  onSuccess,
}) {

  const isEditMode =
    Boolean(employeeId);


  const [departments, setDepartments] =
    useState([]);


  const [loading, setLoading] =
    useState(isEditMode);


  const [loadingDepartments, setLoadingDepartments] =
    useState(true);


  const [submitting, setSubmitting] =
    useState(false);


  const [error, setError] =
    useState("");


  const [fieldErrors, setFieldErrors] =
    useState({});


  const [formData, setFormData] =
    useState({

      employeeCode: "",

      firstName: "",

      lastName: "",

      email: "",

      phone: "",

      gender: "",

      designation: "",

      salary: "",

      joiningDate: "",

      departmentId: "",

      password: "",

    });


  /*
   * =========================================
   * LOAD DEPARTMENTS
   * =========================================
   */

  useEffect(() => {

    let cancelled = false;


    const loadDepartments = async () => {

      try {

        const data =
          await getDepartments();


        if (cancelled) {
          return;
        }


        setDepartments(data || []);

      } catch (error) {

        if (cancelled) {
          return;
        }


        console.error(
          "Failed to load departments:",
          error
        );


        setError(
          "Unable to load departments."
        );

      } finally {

        if (!cancelled) {
          setLoadingDepartments(false);
        }

      }

    };


    loadDepartments();


    return () => {
      cancelled = true;
    };

  }, []);


  /*
   * =========================================
   * LOAD EMPLOYEE WHEN EDITING
   * =========================================
   */

  useEffect(() => {

    if (!employeeId) {
      return;
    }


    let cancelled = false;


    const loadEmployee = async () => {

      try {

        setLoading(true);

        setError("");


        const employee =
          await getEmployeeById(
            employeeId
          );


        if (cancelled) {
          return;
        }


        setFormData({

          employeeCode:
            employee.employeeCode || "",

          firstName:
            employee.firstName || "",

          lastName:
            employee.lastName || "",

          email:
            employee.email || "",

          phone:
            employee.phone || "",

          gender:
            employee.gender || "",

          designation:
            employee.designation || "",

          salary:
            employee.salary || "",

          joiningDate:
            employee.joiningDate || "",

          departmentId:
            employee.departmentId
              ? String(employee.departmentId)
              : "",

          password: "",

        });

      } catch (error) {

        if (cancelled) {
          return;
        }


        console.error(
          "Failed to load employee:",
          error
        );


        setError(
          "Unable to load employee details."
        );

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    };


    loadEmployee();


    return () => {
      cancelled = true;
    };

  }, [employeeId]);


  /*
   * =========================================
   * HANDLE INPUT CHANGES
   * =========================================
   */

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData((current) => ({
      ...current,
      [name]: value,
    }));


    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));


    setError("");

  };


  /*
   * =========================================
   * SUBMIT FORM
   * =========================================
   */

  const handleSubmit = async (event) => {

    event.preventDefault();


    setSubmitting(true);

    setError("");

    setFieldErrors({});


    try {

      /*
       * Password is mandatory when creating
       * a new employee.
       */

      if (
        !isEditMode &&
        !formData.password.trim()
      ) {

        setError(
          "Password is required when creating an employee."
        );

        setSubmitting(false);

        return;
      }


      if (
        !isEditMode &&
        formData.password.length < 8
      ) {

        setError(
          "Password must be at least 8 characters."
        );

        setSubmitting(false);

        return;
      }


      const payload = {

        employeeCode:
          formData.employeeCode.trim(),

        firstName:
          formData.firstName.trim(),

        lastName:
          formData.lastName.trim(),

        email:
          formData.email.trim(),

        phone:
          formData.phone.trim(),

        gender:
          formData.gender,

        designation:
          formData.designation.trim(),

        salary:
          Number(formData.salary),

        joiningDate:
          formData.joiningDate,

        departmentId:
          Number(formData.departmentId),

      };


      /*
       * Send password only when:
       *
       * 1. Creating an employee
       * OR
       * 2. Editing and user entered a
       *    new password.
       */

      if (
        !isEditMode ||
        formData.password.trim()
      ) {

        payload.password =
          formData.password;
      }


      if (isEditMode) {

        await updateEmployee(
          employeeId,
          payload
        );

      } else {

        await createEmployee(
          payload
        );

      }


      onSuccess();

    } catch (error) {

      console.error(
        "Failed to save employee:",
        error
      );


      if (
        error.response?.data?.errors
      ) {

        setFieldErrors(
          error.response.data.errors
        );

      } else if (
        error.response?.data?.message
      ) {

        setError(
          error.response.data.message
        );

      } else if (
        typeof error.response?.data ===
        "string"
      ) {

        setError(
          error.response.data
        );

      } else {

        setError(
          isEditMode
            ? "Unable to update employee. Please try again."
            : "Unable to create employee. Please try again."
        );

      }

    } finally {

      setSubmitting(false);

    }

  };


  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  /*
   * =========================================
   * LOADING EMPLOYEE
   * =========================================
   */

  if (loading) {

    return (

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

        <div className="rounded-2xl bg-white p-8 shadow-xl">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading employee details...
          </p>

        </div>

      </div>

    );

  }


  return (

    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">


        {/* ===================================
            HEADER
            =================================== */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-slate-900">

              {isEditMode
                ? "Edit Employee"
                : "Add New Employee"}

            </h2>


            <p className="mt-1 text-sm text-slate-500">

              {isEditMode
                ? "Update the employee details below."
                : "Enter the employee details and create the login account."}

            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            ✕
          </button>

        </div>


        {/* ===================================
            FORM
            =================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >


          {/* General Error */}

          {error && (

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

            </div>

          )}


          {/* =================================
              EMPLOYEE INFORMATION
              ================================= */}

          <div>

            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Employee Information
            </h3>


            <div className="grid gap-4 sm:grid-cols-2">


              {/* Employee Code */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Employee Code
                </label>

                <input
                  type="text"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  placeholder="EMP003"
                  maxLength={20}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {fieldErrors.employeeCode && (

                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.employeeCode}
                  </p>

                )}

              </div>


              {/* First Name */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={50}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {fieldErrors.firstName && (

                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.firstName}
                  </p>

                )}

              </div>


              {/* Last Name */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={50}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {fieldErrors.lastName && (

                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.lastName}
                  </p>

                )}

              </div>


              {/* Email */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email / Login Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  This email will be used for employee login.
                </p>

                {fieldErrors.email && (

                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.email}
                  </p>

                )}

              </div>


              {/* Phone */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {fieldErrors.phone && (

                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.phone}
                  </p>

                )}

              </div>


              {/* Gender */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="">
                    Select gender
                  </option>

                  <option value="MALE">
                    Male
                  </option>

                  <option value="FEMALE">
                    Female
                  </option>

                  <option value="OTHER">
                    Other
                  </option>

                </select>

                {fieldErrors.gender && (

                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.gender}
                  </p>

                )}

              </div>


              {/* Designation */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Designation
                </label>

                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {fieldErrors.designation && (

                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.designation}
                  </p>

                )}

              </div>


              {/* Salary */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Salary
                </label>

                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {fieldErrors.salary && (

                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.salary}
                  </p>

                )}

              </div>


              {/* Joining Date */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Joining Date
                </label>

                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  max={today}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {fieldErrors.joiningDate && (

                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.joiningDate}
                  </p>

                )}

              </div>


              {/* Department */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Department
                </label>

                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  required
                  disabled={
                    loadingDepartments ||
                    submitting
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                >

                  <option value="">

                    {loadingDepartments
                      ? "Loading departments..."
                      : "Select department"}

                  </option>


                  {departments.map(
                    (department) => (

                      <option
                        key={department.id}
                        value={department.id}
                      >

                        {department.name} (
                        {department.departmentCode})

                      </option>

                    )
                  )}

                </select>

                {fieldErrors.departmentId && (

                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.departmentId}
                  </p>

                )}

              </div>

            </div>

          </div>


          {/* =================================
              LOGIN ACCOUNT
              ================================= */}

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">

            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Employee Login Account
            </h3>

            <p className="mt-1 text-xs text-blue-600">
              The employee will use the email above
              to log in to the EMS.
            </p>


            <div className="mt-4">

              <label className="mb-1.5 block text-sm font-medium text-slate-700">

                {isEditMode
                  ? "New Password (Optional)"
                  : "Login Password"}

              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                maxLength={100}
                required={!isEditMode}
                placeholder={
                  isEditMode
                    ? "Leave blank to keep current password"
                    : "Minimum 8 characters"
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-slate-500">
                {isEditMode
                  ? "Enter a password only if you want to change the employee's login password."
                  : "This password will be securely encrypted before being stored."}
              </p>

              {fieldErrors.password && (

                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.password}
                </p>

              )}

            </div>

          </div>


          {/* =================================
              BUTTONS
              ================================= */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                submitting ||
                loadingDepartments
              }
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {submitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Employee"
                  : "Create Employee & Account"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );
}


export default EmployeeForm;