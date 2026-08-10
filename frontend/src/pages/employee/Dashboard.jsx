import { useEffect, useState } from "react";

import { useAuth } from "../../hooks/useAuth";

import {
  getCurrentEmployee,
} from "../../api/employeeApi";


function EmployeeDashboard() {

  const { user, loading: authLoading } =
    useAuth();


  const [employee, setEmployee] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
   * =========================================
   * LOAD CURRENT EMPLOYEE
   * =========================================
   */

  useEffect(() => {

    let cancelled = false;


    const loadEmployee = async () => {

      try {

        const data =
          await getCurrentEmployee();


        if (cancelled) {
          return;
        }


        setEmployee(data);

        setError("");

      } catch (error) {

        if (cancelled) {
          return;
        }


        console.error(
          "Failed to load employee profile:",
          error
        );


        const responseData =
          error?.response?.data;


        if (
          typeof responseData ===
          "string"
        ) {

          setError(responseData);

        } else if (
          responseData?.message
        ) {

          setError(
            responseData.message
          );

        } else {

          setError(
            "Unable to load employee information."
          );

        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    };


    if (!authLoading && user) {
      loadEmployee();
    }


    return () => {
      cancelled = true;
    };

  }, [authLoading, user]);


  /*
   * =========================================
   * FORMAT DATE
   * =========================================
   */

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }


    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  /*
   * =========================================
   * FORMAT SALARY
   * =========================================
   */

  const formatSalary = (salary) => {

    if (
      salary === null ||
      salary === undefined
    ) {
      return "-";
    }


    return Number(salary).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    );

  };


  /*
   * =========================================
   * AUTH LOADING
   * =========================================
   */

  if (authLoading) {

    return (

      <div className="flex min-h-[400px] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading dashboard...
          </p>

        </div>

      </div>

    );

  }


  /*
   * =========================================
   * NO USER
   * =========================================
   */

  if (!user) {

    return (

      <div className="rounded-xl border border-red-200 bg-red-50 p-6">

        <h2 className="font-semibold text-red-700">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm text-red-600">
          Please log in again.
        </p>

      </div>

    );

  }


  /*
   * =========================================
   * EMPLOYEE DATA LOADING
   * =========================================
   */

  if (loading) {

    return (

      <div className="flex min-h-[400px] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your employee information...
          </p>

        </div>

      </div>

    );

  }


  /*
   * =========================================
   * EMPLOYEE DATA ERROR
   * =========================================
   */

  if (error || !employee) {

    return (

      <div className="rounded-xl border border-red-200 bg-red-50 p-6">

        <h2 className="font-semibold text-red-700">
          Employee Information Not Found
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error ||
            "No employee record is associated with your account."}
        </p>

        <p className="mt-3 text-xs text-red-500">
          Make sure your login email matches
          the email registered in your employee
          record.
        </p>

      </div>

    );

  }


  /*
   * =========================================
   * STATUS STYLE
   * =========================================
   */

  const statusClass =
    employee.status === "ACTIVE"
      ? "bg-green-50 text-green-700"
      : employee.status === "ON_LEAVE"
        ? "bg-amber-50 text-amber-700"
        : employee.status === "TERMINATED"
          ? "bg-red-50 text-red-700"
          : "bg-slate-100 text-slate-600";


  /*
   * =========================================
   * DASHBOARD
   * =========================================
   */

  return (

    <div className="space-y-6">


      {/* =====================================
          HEADER
          ===================================== */}

      <div>

        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Employee Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back,{" "}
          {employee.firstName}{" "}
          {employee.lastName}.
        </p>

      </div>


      {/* =====================================
          PROFILE HEADER
          ===================================== */}

      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-sm sm:p-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">


          {/* Avatar */}

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-bold text-blue-600">

            {employee.firstName
              ?.charAt(0)
              ?.toUpperCase() || "E"}

          </div>


          {/* Employee Information */}

          <div>

            <p className="text-sm text-blue-100">
              Welcome back
            </p>

            <h2 className="mt-1 text-2xl font-bold">

              {employee.firstName}{" "}

              {employee.lastName}

            </h2>

            <p className="mt-1 text-sm text-blue-100">
              {employee.designation}
            </p>

            <p className="mt-1 text-sm text-blue-100">
              {employee.email}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================
          EMPLOYMENT SUMMARY
          ===================================== */}

      <div>

        <h2 className="text-lg font-semibold text-slate-900">
          Employment Summary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your current employment information.
        </p>

      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


        {/* Employee Code */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Employee ID
          </p>

          <p className="mt-2 text-lg font-semibold text-slate-800">
            {employee.employeeCode || "-"}
          </p>

        </div>


        {/* Designation */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Designation
          </p>

          <p className="mt-2 text-lg font-semibold text-slate-800">
            {employee.designation || "-"}
          </p>

        </div>


        {/* Department */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Department
          </p>

          <p className="mt-2 text-lg font-semibold text-slate-800">
            {employee.departmentName || "-"}
          </p>

          {employee.departmentCode && (

            <p className="mt-1 text-xs text-slate-400">
              {employee.departmentCode}
            </p>

          )}

        </div>


        {/* Joining Date */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Joining Date
          </p>

          <p className="mt-2 text-lg font-semibold text-slate-800">
            {formatDate(
              employee.joiningDate
            )}
          </p>

        </div>


        {/* Status */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Employment Status
          </p>

          <div className="mt-2">

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
            >
              {employee.status ||
                "UNKNOWN"}
            </span>

          </div>

        </div>


        {/* Salary */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Salary
          </p>

          <p className="mt-2 text-lg font-semibold text-slate-800">
            {formatSalary(
              employee.salary
            )}
          </p>

        </div>

      </div>


      {/* =====================================
          PERSONAL INFORMATION
          ===================================== */}

      <div>

        <h2 className="text-lg font-semibold text-slate-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your registered personal details.
        </p>

      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


        {/* First Name */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            First Name
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {employee.firstName || "-"}
          </p>

        </div>


        {/* Last Name */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Last Name
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {employee.lastName || "-"}
          </p>

        </div>


        {/* Email */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Email
          </p>

          <p className="mt-2 break-all text-sm font-semibold text-slate-800">
            {employee.email || "-"}
          </p>

        </div>


        {/* Phone */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Phone
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {employee.phone || "-"}
          </p>

        </div>


        {/* Gender */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Gender
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {employee.gender || "-"}
          </p>

        </div>


        {/* Account Email */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Login Email
          </p>

          <p className="mt-2 break-all text-sm font-semibold text-slate-800">
            {user.email || "-"}
          </p>

        </div>

      </div>


      {/* =====================================
          QUICK ACCESS
          ===================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Quick Access
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage your account information and
          security.
        </p>


        <div className="mt-5 flex flex-wrap gap-3">

          <a
            href="/profile"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View My Profile
          </a>

        </div>

      </div>

    </div>

  );

}


export default EmployeeDashboard;