import { useEffect, useState } from "react";

import {
  getDepartments,
  deleteDepartment,
  getEmployeesByDepartment,
} from "../../api/departmentApi";

import DepartmentTable from "../../components/DepartmentTable/DepartmentTable";
import DepartmentForm from "../../components/DepartmentForm/DepartmentForm";
import { useAuth } from "../../hooks/useAuth";

function Departments() {
  const { user } = useAuth();

  const role = user?.role;

  /*
   * Role permissions
   */

  const canEdit =
    role === "ADMIN" ||
    role === "HR";

  const canDelete =
    role === "ADMIN";


  /*
   * Departments
   */

  const [departments, setDepartments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
   * Add / Edit
   */

  const [showForm, setShowForm] =
    useState(false);

  const [editingDepartmentId, setEditingDepartmentId] =
    useState(null);


  /*
   * Delete
   */

  const [departmentToDelete, setDepartmentToDelete] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);


  /*
   * Refresh
   */

  const [refreshKey, setRefreshKey] =
    useState(0);


  /*
   * Selected department
   * for viewing employees
   */

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  const [departmentEmployees, setDepartmentEmployees] =
    useState([]);

  const [loadingEmployees, setLoadingEmployees] =
    useState(false);


  /*
   * Load departments
   */

  useEffect(() => {
    let cancelled = false;

    const loadDepartments = async () => {
      setLoading(true);

      try {
        const data =
          await getDepartments();

        if (cancelled) {
          return;
        }

        setDepartments(
          data || []
        );

        setError("");

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

        setDepartments([]);

      } finally {

        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDepartments();

    return () => {
      cancelled = true;
    };

  }, [refreshKey]);


  /*
   * Add Department
   */

  const handleAdd = () => {
    setEditingDepartmentId(null);
    setShowForm(true);
  };


  /*
   * Edit Department
   */

  const handleEdit = (department) => {

    if (!canEdit) {
      return;
    }

    setEditingDepartmentId(
      department.id
    );

    setShowForm(true);
  };


  /*
   * Department form success
   */

  const handleFormSuccess = () => {

    setShowForm(false);

    setEditingDepartmentId(null);

    setRefreshKey(
      (current) =>
        current + 1
    );
  };


  /*
   * Open delete confirmation
   */

  const handleDelete = (department) => {

    if (!canDelete) {
      return;
    }

    setDepartmentToDelete(
      department
    );
  };


  /*
   * Confirm delete
   */

  const handleConfirmDelete =
    async () => {

      if (
        !departmentToDelete ||
        !canDelete
      ) {
        return;
      }

      try {

        setDeleting(true);

        setError("");

        await deleteDepartment(
          departmentToDelete.id
        );

        setDepartmentToDelete(
          null
        );

        setRefreshKey(
          (current) =>
            current + 1
        );

      } catch (error) {

        console.error(
          "Failed to delete department:",
          error
        );

        setError(
          "Unable to delete department. It may contain employees."
        );

      } finally {

        setDeleting(false);
      }
    };


  /*
   * View employees in department
   */

  const handleViewEmployees =
    async (department) => {

      try {

        setSelectedDepartment(
          department
        );

        setDepartmentEmployees([]);

        setLoadingEmployees(true);

        setError("");

        const employees =
          await getEmployeesByDepartment(
            department.id
          );

        setDepartmentEmployees(
          employees || []
        );

      } catch (error) {

        console.error(
          "Failed to load department employees:",
          error
        );

        setError(
          "Unable to load employees for this department."
        );

      } finally {

        setLoadingEmployees(false);
      }
    };


  /*
   * Close employee modal
   */

  const handleCloseEmployees =
    () => {

      setSelectedDepartment(null);

      setDepartmentEmployees([]);

      setLoadingEmployees(false);
    };


  /*
   * Active department count
   */

  const activeDepartments =
    departments.filter(
      (department) =>
        department.status ===
        "ACTIVE"
    ).length;


  /*
   * Inactive department count
   */

  const inactiveDepartments =
    departments.filter(
      (department) =>
        department.status !==
        "ACTIVE"
    ).length;


  return (
    <div className="space-y-6">

      {/* =========================
          PAGE HEADER
          ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Departments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage departments in your organization.
          </p>

        </div>


        {/* Add Department */}

        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Department
        </button>

      </div>


      {/* =========================
          ERROR MESSAGE
          ========================= */}

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">

          <div className="flex items-start justify-between gap-4">

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Dismiss
            </button>

          </div>

        </div>

      )}


      {/* =========================
          SUMMARY CARDS
          ========================= */}

      {!loading && (

        <div className="grid gap-4 sm:grid-cols-3">

          {/* Total */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Departments
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {departments.length}
            </p>

          </div>


          {/* Active */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Active Departments
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {activeDepartments}
            </p>

          </div>


          {/* Inactive */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Inactive Departments
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-500">
              {inactiveDepartments}
            </p>

          </div>

        </div>

      )}


      {/* =========================
          DEPARTMENT TABLE
          ========================= */}

      <DepartmentTable
        departments={departments}
        loading={loading}
        onEdit={
          canEdit
            ? handleEdit
            : undefined
        }
        onDelete={
          canDelete
            ? handleDelete
            : undefined
        }
        onViewEmployees={
          handleViewEmployees
        }
      />


      {/* =========================
          ADD / EDIT FORM
          ========================= */}

      {showForm && (

        <DepartmentForm
          departmentId={
            editingDepartmentId
          }

          onClose={() => {

            setShowForm(false);

            setEditingDepartmentId(
              null
            );

          }}

          onSuccess={
            handleFormSuccess
          }
        />

      )}


      {/* =========================
          DELETE MODAL
          ADMIN ONLY
          ========================= */}

      {departmentToDelete && canDelete && (

        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="border-b border-slate-200 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-xl">
                  ⚠️
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Delete Department?
                  </h2>

                  <p className="text-sm text-slate-500">
                    This action cannot be undone.
                  </p>

                </div>

              </div>

            </div>


            {/* Content */}

            <div className="px-6 py-5">

              <p className="text-sm leading-6 text-slate-600">

                Are you sure you want to delete{" "}

                <span className="font-semibold text-slate-900">
                  {departmentToDelete.name}
                </span>

                ?

              </p>


              <div className="mt-4 rounded-lg bg-slate-50 p-4">

                <div className="grid grid-cols-2 gap-3">

                  <div>

                    <p className="text-xs text-slate-400">
                      Department Code
                    </p>

                    <p className="font-medium text-slate-700">
                      {
                        departmentToDelete.departmentCode
                      }
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-slate-400">
                      Status
                    </p>

                    <p className="font-medium text-slate-700">
                      {
                        departmentToDelete.status
                      }
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Footer */}

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setDepartmentToDelete(
                    null
                  )
                }
                disabled={deleting}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleConfirmDelete
                }
                disabled={deleting}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Department"}
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =========================
          VIEW DEPARTMENT EMPLOYEES
          ========================= */}

      {selectedDepartment && (

        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedDepartment.name}
                  </h2>

                  <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                    {
                      selectedDepartment.departmentCode
                    }
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Employees in this department
                </p>

              </div>


              <button
                type="button"
                onClick={
                  handleCloseEmployees
                }
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                ✕
              </button>

            </div>


            {/* Employee Content */}

            <div className="max-h-[60vh] overflow-y-auto p-6">

              {loadingEmployees ? (

                <div className="py-10 text-center">

                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

                  <p className="mt-4 text-sm text-slate-500">
                    Loading employees...
                  </p>

                </div>

              ) : departmentEmployees.length === 0 ? (

                <div className="rounded-xl bg-slate-50 p-10 text-center">

                  <div className="text-3xl">
                    👥
                  </div>

                  <h3 className="mt-3 font-semibold text-slate-900">
                    No employees
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    There are no employees assigned to this department.
                  </p>

                </div>

              ) : (

                <div className="overflow-hidden rounded-xl border border-slate-200">

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[700px] text-left">

                      <thead className="border-b border-slate-200 bg-slate-50">

                        <tr>

                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Employee
                          </th>

                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Designation
                          </th>

                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Email
                          </th>

                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Phone
                          </th>

                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Status
                          </th>

                        </tr>

                      </thead>


                      <tbody className="divide-y divide-slate-100">

                        {departmentEmployees.map(
                          (employee) => (

                            <tr
                              key={
                                employee.id
                              }
                              className="transition hover:bg-slate-50"
                            >

                              {/* Employee */}

                              <td className="px-4 py-4">

                                <p className="font-semibold text-slate-900">

                                  {
                                    employee.firstName
                                  }{" "}

                                  {
                                    employee.lastName
                                  }

                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">

                                  {
                                    employee.employeeCode
                                  }

                                </p>

                              </td>


                              {/* Designation */}

                              <td className="px-4 py-4 text-sm text-slate-600">

                                {
                                  employee.designation
                                }

                              </td>


                              {/* Email */}

                              <td className="px-4 py-4 text-sm text-slate-600">

                                {
                                  employee.email
                                }

                              </td>


                              {/* Phone */}

                              <td className="px-4 py-4 text-sm text-slate-600">

                                {
                                  employee.phone ||
                                  "—"
                                }

                              </td>


                              {/* Status */}

                              <td className="px-4 py-4">

                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    employee.status ===
                                    "ACTIVE"
                                      ? "bg-green-50 text-green-700"
                                      : employee.status ===
                                        "ON_LEAVE"
                                        ? "bg-amber-50 text-amber-700"
                                        : employee.status ===
                                          "TERMINATED"
                                          ? "bg-red-50 text-red-700"
                                          : "bg-slate-100 text-slate-600"
                                  }`}
                                >

                                  {
                                    employee.status
                                  }

                                </span>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              )}

            </div>


            {/* Footer */}

            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">

              <p className="text-sm text-slate-500">

                {loadingEmployees
                  ? "Loading..."
                  : `${departmentEmployees.length} employee${
                      departmentEmployees.length !==
                      1
                        ? "s"
                        : ""
                    }`}

              </p>


              <button
                type="button"
                onClick={
                  handleCloseEmployees
                }
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Departments;