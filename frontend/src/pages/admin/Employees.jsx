import { useEffect, useState } from "react";

import {
  getEmployees,
  deleteEmployee,
} from "../../api/employeeApi";

import EmployeeTable from "../../components/EmployeeTable/EmployeeTable";
import EmployeeForm from "../../components/EmployeeForm/EmployeeForm";
import DeleteEmployeeModal from "../../components/DeleteEmployeeModal/DeleteEmployeeModal";
import EmployeeDetailsModal from "../../components/EmployeeDetailsModal/EmployeeDetailsModal";

function Employees() {
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
   * Search
   */

  const [search, setSearch] = useState("");

  const [searchInput, setSearchInput] = useState("");

  /*
   * Pagination
   */

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const size = 10;

  /*
   * Sorting
   */

  const [sortBy, setSortBy] = useState("id");

  const [direction, setDirection] = useState("asc");

  /*
   * Refresh
   */

  const [refreshKey, setRefreshKey] = useState(0);

  /*
   * Add / Edit
   */

  const [showAddEmployee, setShowAddEmployee] =
    useState(false);

  const [editingEmployeeId, setEditingEmployeeId] =
    useState(null);

  /*
   * View Employee
   */

  const [viewingEmployeeId, setViewingEmployeeId] =
    useState(null);

  /*
   * Delete
   */

  const [employeeToDelete, setEmployeeToDelete] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);


  /*
   * Load employees
   */

  useEffect(() => {
    let cancelled = false;

    const loadEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEmployees({
          search,
          page,
          size,
          sortBy,
          direction,
        });

        if (cancelled) {
          return;
        }

        setEmployees(data.content || []);

        setTotalPages(
          data.totalPages || 0
        );

        setTotalElements(
          data.totalElements || 0
        );

      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load employees:",
          error
        );

        setError(
          "Unable to load employees."
        );

        setEmployees([]);

        setTotalPages(0);

        setTotalElements(0);

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadEmployees();

    return () => {
      cancelled = true;
    };

  }, [
    search,
    page,
    sortBy,
    direction,
    refreshKey,
  ]);


  /*
   * Search
   */

  const handleSearch = (event) => {
    event.preventDefault();

    setPage(0);

    setSearch(
      searchInput.trim()
    );
  };


  /*
   * Clear Search
   */

  const handleClearSearch = () => {
    setSearchInput("");

    setSearch("");

    setPage(0);
  };


  /*
   * Sorting
   */

  const handleSortChange = (event) => {
    setSortBy(
      event.target.value
    );

    setPage(0);
  };


  /*
   * Toggle sort direction
   */

  const handleDirectionChange = () => {
    setDirection(
      (current) =>
        current === "asc"
          ? "desc"
          : "asc"
    );

    setPage(0);
  };


  /*
   * View Employee
   */

  const handleView = (employee) => {
    setViewingEmployeeId(
      employee.id
    );
  };


  /*
   * Edit Employee
   */

  const handleEdit = (employee) => {
    setEditingEmployeeId(
      employee.id
    );
  };


  /*
   * Open Delete Modal
   */

  const handleDelete = (employee) => {
    setEmployeeToDelete(
      employee
    );
  };


  /*
   * Confirm Delete
   */

  const handleConfirmDelete =
    async () => {

      if (!employeeToDelete) {
        return;
      }

      try {
        setDeleting(true);
        setError("");

        await deleteEmployee(
          employeeToDelete.id
        );

        setEmployeeToDelete(null);

        /*
         * If this was the only
         * employee on the current page,
         * go back one page.
         */

        if (
          employees.length === 1 &&
          page > 0
        ) {
          setPage(
            (current) =>
              current - 1
          );
        } else {
          setRefreshKey(
            (current) =>
              current + 1
          );
        }

      } catch (error) {

        console.error(
          "Failed to delete employee:",
          error
        );

        setError(
          "Unable to delete employee."
        );

      } finally {
        setDeleting(false);
      }
    };


  /*
   * Employee Created
   */

  const handleEmployeeCreated =
    () => {

      setShowAddEmployee(false);

      setPage(0);

      setSearch("");

      setSearchInput("");

      setRefreshKey(
        (current) =>
          current + 1
      );
    };


  /*
   * Employee Updated
   */

  const handleEmployeeUpdated =
    () => {

      setEditingEmployeeId(
        null
      );

      setRefreshKey(
        (current) =>
          current + 1
      );
    };


  /*
   * Pagination display
   */

  const firstEmployeeNumber =
    totalElements === 0
      ? 0
      : page * size + 1;

  const lastEmployeeNumber =
    Math.min(
      (page + 1) * size,
      totalElements
    );


  return (
    <div className="space-y-6">

      {/* =========================
          PAGE HEADER
          ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Employees
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage employees in your organization.
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            setShowAddEmployee(true)
          }
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Employee
        </button>

      </div>


      {/* =========================
          SEARCH & SORTING
          ========================= */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-4"
        >

          {/* Search */}

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="flex-1">

              <input
                type="text"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value
                  )
                }
                placeholder="Search by first name, last name or email..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search
            </button>


            {(search ||
              searchInput) && (

              <button
                type="button"
                onClick={
                  handleClearSearch
                }
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Clear
              </button>

            )}

          </div>


          {/* Sorting */}

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">

            <span className="text-sm font-medium text-slate-600">
              Sort by:
            </span>


            <select
              value={sortBy}
              onChange={
                handleSortChange
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              <option value="id">
                Employee ID
              </option>

              <option value="firstName">
                First Name
              </option>

              <option value="lastName">
                Last Name
              </option>

              <option value="email">
                Email
              </option>

              <option value="joiningDate">
                Joining Date
              </option>

              <option value="salary">
                Salary
              </option>

            </select>


            <button
              type="button"
              onClick={
                handleDirectionChange
              }
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {direction === "asc"
                ? "↑ Ascending"
                : "↓ Descending"}
            </button>

          </div>

        </form>

      </div>


      {/* =========================
          ACTIVE SEARCH
          ========================= */}

      {search && (

        <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">

          <p className="text-sm text-blue-700">

            Searching for{" "}

            <span className="font-semibold">
              "{search}"
            </span>

          </p>

          <button
            type="button"
            onClick={
              handleClearSearch
            }
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            Clear
          </button>

        </div>

      )}


      {/* =========================
          ERROR
          ========================= */}

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

        </div>

      )}


      {/* =========================
          EMPLOYEE TABLE
          ========================= */}

      <EmployeeTable
        employees={employees}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />


      {/* =========================
          PAGINATION
          ========================= */}

      {!loading &&
        totalElements > 0 && (

          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500">

              Showing{" "}

              <span className="font-semibold text-slate-700">
                {firstEmployeeNumber}
              </span>

              {" "}to{" "}

              <span className="font-semibold text-slate-700">
                {lastEmployeeNumber}
              </span>

              {" "}of{" "}

              <span className="font-semibold text-slate-700">
                {totalElements}
              </span>

              {" "}employees

            </p>


            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={page === 0}
                onClick={() =>
                  setPage(
                    (current) =>
                      current - 1
                  )
                }
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>


              <span className="px-3 text-sm text-slate-500">

                Page{" "}

                <span className="font-semibold text-slate-700">
                  {page + 1}
                </span>

                {" "}of{" "}

                <span className="font-semibold text-slate-700">
                  {totalPages}
                </span>

              </span>


              <button
                type="button"
                disabled={
                  page >=
                  totalPages - 1
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1
                  )
                }
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>

          </div>

        )}


      {/* =========================
          ADD EMPLOYEE
          ========================= */}

      {showAddEmployee && (

        <EmployeeForm
          onClose={() =>
            setShowAddEmployee(false)
          }
          onSuccess={
            handleEmployeeCreated
          }
        />

      )}


      {/* =========================
          EDIT EMPLOYEE
          ========================= */}

      {editingEmployeeId && (

        <EmployeeForm
          employeeId={
            editingEmployeeId
          }
          onClose={() =>
            setEditingEmployeeId(
              null
            )
          }
          onSuccess={
            handleEmployeeUpdated
          }
        />

      )}


      {/* =========================
          VIEW EMPLOYEE
          ========================= */}

      {viewingEmployeeId && (

        <EmployeeDetailsModal
          employeeId={
            viewingEmployeeId
          }
          onClose={() =>
            setViewingEmployeeId(
              null
            )
          }
        />

      )}


      {/* =========================
          DELETE EMPLOYEE
          ========================= */}

      {employeeToDelete && (

        <DeleteEmployeeModal
          employee={
            employeeToDelete
          }
          deleting={deleting}
          onCancel={() =>
            setEmployeeToDelete(
              null
            )
          }
          onConfirm={
            handleConfirmDelete
          }
        />

      )}

    </div>
  );
}

export default Employees;