import { useEffect, useState } from "react";

import { useAuth } from "../../hooks/useAuth";
import { changePassword } from "../../api/authApi";
import { getCurrentEmployee } from "../../api/employeeApi";


function Profile() {

  const { user, loading } = useAuth();


  /*
   * Employee profile
   */

  const [employee, setEmployee] =
    useState(null);

  const [employeeLoading, setEmployeeLoading] =
    useState(false);

  const [employeeError, setEmployeeError] =
    useState("");


  /*
   * Password form
   */

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordSuccess, setPasswordSuccess] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");


  /*
   * =========================================
   * LOAD EMPLOYEE PROFILE
   * =========================================
   */

  useEffect(() => {

    if (
      loading ||
      !user ||
      user.role !== "EMPLOYEE"
    ) {
      return;
    }


    let cancelled = false;


    const loadEmployeeProfile = async () => {

      try {

        setEmployeeLoading(true);
        setEmployeeError("");


        const data =
          await getCurrentEmployee();


        if (cancelled) {
          return;
        }


        setEmployee(data);

      } catch (error) {

        if (cancelled) {
          return;
        }


        console.error(
          "Failed to load employee profile:",
          error
        );


        const message =
          error?.response?.data?.message;


        setEmployeeError(
          message ||
          "Unable to load employee information."
        );

      } finally {

        if (!cancelled) {
          setEmployeeLoading(false);
        }

      }

    };


    loadEmployeeProfile();


    return () => {
      cancelled = true;
    };

  }, [user, loading]);


  /*
   * =========================================
   * ROLE STYLING
   * =========================================
   */

  const getRoleClass = (role) => {

    switch (role) {

      case "ADMIN":
        return "bg-purple-50 text-purple-700";

      case "HR":
        return "bg-blue-50 text-blue-700";

      case "EMPLOYEE":
        return "bg-green-50 text-green-700";

      default:
        return "bg-slate-100 text-slate-600";

    }

  };


  /*
   * =========================================
   * STATUS STYLING
   * =========================================
   */

  const getEmployeeStatusClass = (
    status
  ) => {

    switch (status) {

      case "ACTIVE":
        return "bg-green-50 text-green-700";

      case "ON_LEAVE":
        return "bg-amber-50 text-amber-700";

      case "TERMINATED":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";

    }

  };


  /*
   * =========================================
   * DATE FORMATTING
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
        month: "long",
        year: "numeric",
      }
    );

  };


  /*
   * =========================================
   * CHANGE PASSWORD
   * =========================================
   */

  const handleChangePassword =
    async (event) => {

      event.preventDefault();


      setPasswordSuccess("");
      setPasswordError("");


      /*
       * Validation
       */

      if (!currentPassword) {

        setPasswordError(
          "Please enter your current password."
        );

        return;
      }


      if (!newPassword) {

        setPasswordError(
          "Please enter a new password."
        );

        return;
      }


      if (newPassword.length < 8) {

        setPasswordError(
          "New password must be at least 8 characters."
        );

        return;
      }


      if (
        newPassword !==
        confirmPassword
      ) {

        setPasswordError(
          "New password and confirm password do not match."
        );

        return;
      }


      if (
        currentPassword ===
        newPassword
      ) {

        setPasswordError(
          "New password must be different from your current password."
        );

        return;
      }


      try {

        setChangingPassword(true);


        await changePassword({
          currentPassword,
          newPassword,
          confirmPassword,
        });


        setPasswordSuccess(
          "Password changed successfully."
        );


        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

      } catch (error) {

        console.error(
          "Failed to change password:",
          error
        );


        const message =
          error?.response?.data;


        if (
          typeof message ===
          "string"
        ) {

          setPasswordError(
            message
          );

        } else if (
          error?.response?.data?.message
        ) {

          setPasswordError(
            error.response.data.message
          );

        } else {

          setPasswordError(
            "Unable to change password. Please try again."
          );

        }

      } finally {

        setChangingPassword(false);

      }

    };


  /*
   * =========================================
   * LOADING
   * =========================================
   */

  if (loading) {

    return (

      <div className="flex min-h-[400px] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading profile...
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
          Unable to load profile
        </h2>

        <p className="mt-2 text-sm text-red-600">
          Please log in again.
        </p>

      </div>

    );

  }


  const isEnabled =
    user.enabled !== false;


  const isEmployee =
    user.role === "EMPLOYEE";


  return (

    <div className="space-y-6">


      {/* =====================================
          PAGE HEADER
          ===================================== */}

      <div>

        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">

          {isEmployee
            ? "View your employee and account information."
            : "View and manage your account."}

        </p>

      </div>


      {/* =====================================
          PROFILE HEADER
          ===================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 sm:px-8">

          <div className="flex flex-col items-center gap-5 sm:flex-row">


            {/* Avatar */}

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white text-3xl font-bold text-blue-600 shadow-lg">

              {(isEmployee
                ? employee?.firstName
                : user.name
              )
                ?.charAt(0)
                ?.toUpperCase() || "U"}

            </div>


            {/* User information */}

            <div className="text-center sm:text-left">

              <h2 className="text-2xl font-bold text-white">

                {isEmployee
                  ? `${employee?.firstName || ""} ${employee?.lastName || ""}`.trim() ||
                    user.name ||
                    "Employee"
                  : user.name || "User"}

              </h2>


              <p className="mt-1 text-sm text-blue-100">

                {user.email}

              </p>


              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${getRoleClass(
                  user.role
                )}`}
              >

                {user.role || "USER"}

              </span>

            </div>

          </div>

        </div>


        {/* ===================================
            EMPLOYEE INFORMATION
            =================================== */}

        {isEmployee && (

          <div className="p-6 sm:p-8">

            <div>

              <h3 className="text-lg font-semibold text-slate-900">
                Employee Information
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your employment information maintained by the organization.
              </p>

            </div>


            {/* Loading */}

            {employeeLoading && (

              <div className="mt-6 flex items-center gap-3 rounded-lg bg-slate-50 p-4">

                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />

                <p className="text-sm text-slate-500">
                  Loading employee information...
                </p>

              </div>

            )}


            {/* Error */}

            {!employeeLoading &&
              employeeError && (

                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">

                  <p className="text-sm font-medium text-red-700">
                    {employeeError}
                  </p>

                </div>

              )}


            {/* Employee Details */}

            {!employeeLoading &&
              !employeeError &&
              employee && (

                <div className="mt-6 grid gap-5 sm:grid-cols-2">


                  {/* Employee Code */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Employee Code
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {employee.employeeCode || "-"}
                    </p>

                  </div>


                  {/* Email */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Email Address
                    </p>

                    <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                      {employee.email || user.email || "-"}
                    </p>

                  </div>


                  {/* Phone */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Phone
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {employee.phone || "-"}
                    </p>

                  </div>


                  {/* Gender */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Gender
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {employee.gender || "-"}
                    </p>

                  </div>


                  {/* Designation */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Designation
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {employee.designation || "-"}
                    </p>

                  </div>


                  {/* Department */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Department
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {employee.departmentName || "-"}
                    </p>

                    {employee.departmentCode && (

                      <p className="mt-1 text-xs text-slate-400">
                        {employee.departmentCode}
                      </p>

                    )}

                  </div>


                  {/* Joining Date */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Joining Date
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {formatDate(
                        employee.joiningDate
                      )}
                    </p>

                  </div>


                  {/* Status */}

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Employment Status
                    </p>

                    <div className="mt-2">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getEmployeeStatusClass(
                          employee.status
                        )}`}
                      >
                        {employee.status || "UNKNOWN"}
                      </span>

                    </div>

                  </div>


                  {/* Salary */}

                  <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Salary
                    </p>

                    <p className="mt-2 text-lg font-bold text-slate-800">

                      {employee.salary !== null &&
                      employee.salary !== undefined
                        ? `₹${Number(
                            employee.salary
                          ).toLocaleString("en-IN")}`
                        : "-"}

                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Employment information maintained by HR/Admin.
                    </p>

                  </div>

                </div>

              )}

          </div>

        )}


        {/* ===================================
            ACCOUNT INFORMATION
            =================================== */}

        <div className="border-t border-slate-200 p-6 sm:p-8">

          <h3 className="text-lg font-semibold text-slate-900">
            Account Information
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Your registered account details.
          </p>


          <div className="mt-6 grid gap-5 sm:grid-cols-2">


            {/* Name */}

            <div className="rounded-xl border border-slate-200 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Full Name
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {user.name || "-"}
              </p>

            </div>


            {/* Email */}

            <div className="rounded-xl border border-slate-200 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Email Address
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                {user.email || "-"}
              </p>

            </div>


            {/* Role */}

            <div className="rounded-xl border border-slate-200 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Role
              </p>

              <div className="mt-2">

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleClass(
                    user.role
                  )}`}
                >
                  {user.role || "USER"}
                </span>

              </div>

            </div>


            {/* Account Status */}

            <div className="rounded-xl border border-slate-200 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Account Status
              </p>

              <div className="mt-2">

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    isEnabled
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >

                  {isEnabled
                    ? "ACTIVE"
                    : "DISABLED"}

                </span>

              </div>

            </div>


            {/* User ID */}

            <div className="rounded-xl border border-slate-200 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                User ID
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {user.id ?? "-"}
              </p>

            </div>


            {/* Created */}

            <div className="rounded-xl border border-slate-200 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Account Created
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {formatDate(
                  user.createdAt
                )}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          CHANGE PASSWORD
          ===================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl">
            🔐
          </div>


          <div>

            <h3 className="text-lg font-semibold text-slate-900">
              Change Password
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Update your account password securely.
            </p>

          </div>

        </div>


        {/* Success */}

        {passwordSuccess && (

          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">

            <p className="text-sm font-medium text-green-700">
              {passwordSuccess}
            </p>

          </div>

        )}


        {/* Error */}

        {passwordError && (

          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">

            <p className="text-sm font-medium text-red-700">
              {passwordError}
            </p>

          </div>

        )}


        <form
          onSubmit={handleChangePassword}
          className="mt-6 max-w-xl space-y-5"
        >


          {/* Current Password */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(
                  event.target.value
                )
              }
              placeholder="Enter current password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          {/* New Password */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(
                  event.target.value
                )
              }
              placeholder="Enter new password"
              autoComplete="new-password"
              minLength={8}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1 text-xs text-slate-400">
              Password must contain at least 8 characters.
            </p>

          </div>


          {/* Confirm Password */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Confirm new password"
              autoComplete="new-password"
              minLength={8}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          {/* Submit */}

          <button
            type="submit"
            disabled={changingPassword}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {changingPassword
              ? "Changing Password..."
              : "Change Password"}

          </button>

        </form>

      </div>

    </div>

  );

}


export default Profile;