import { useAuth } from "../../hooks/useAuth";

function EmployeeTable({
  employees,
  loading,
  onView,
  onEdit,
  onDelete,
}) {
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
   * Format Date
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
   * Status Styling
   */

  const getStatusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-600";

      case "ON_LEAVE":
        return "bg-amber-50 text-amber-600";

      case "TERMINATED":
        return "bg-red-50 text-red-600";

      case "INACTIVE":
        return "bg-slate-100 text-slate-500";

      default:
        return "bg-slate-100 text-slate-500";
    }
  };


  /*
   * Loading
   */

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

        <div className="flex flex-col items-center justify-center py-8">

          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading employees...
          </p>

        </div>

      </div>
    );
  }


  /*
   * Empty State
   */

  if (
    !employees ||
    employees.length === 0
  ) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">

        <div className="text-3xl">
          👥
        </div>

        <h3 className="mt-3 font-semibold text-slate-800">
          No employees found
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Try changing your search criteria.
        </p>

      </div>
    );
  }


  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* =========================
          DESKTOP TABLE
          ========================= */}

      <div className="hidden overflow-x-auto md:block">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Employee
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Designation
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Department
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Joining Date
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>

            </tr>

          </thead>


          <tbody className="divide-y divide-slate-100">

            {employees.map((employee) => (

              <tr
                key={employee.id}
                className="transition hover:bg-slate-50"
              >

                {/* Employee */}

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">

                      {employee.firstName
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>


                    <div>

                      <p className="text-sm font-semibold text-slate-800">

                        {employee.firstName}{" "}

                        {employee.lastName}

                      </p>

                      <p className="text-xs text-slate-400">
                        {employee.employeeCode}
                      </p>

                    </div>

                  </div>

                </td>


                {/* Designation */}

                <td className="px-6 py-4">

                  <p className="text-sm text-slate-700">
                    {employee.designation || "-"}
                  </p>

                </td>


                {/* Department */}

                <td className="px-6 py-4">

                  <p className="text-sm font-medium text-slate-700">
                    {employee.departmentName || "-"}
                  </p>

                  <p className="text-xs text-slate-400">
                    {employee.departmentCode || ""}
                  </p>

                </td>


                {/* Joining Date */}

                <td className="px-6 py-4 text-sm text-slate-600">

                  {formatDate(
                    employee.joiningDate
                  )}

                </td>


                {/* Status */}

                <td className="px-6 py-4">

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      employee.status
                    )}`}
                  >
                    {employee.status || "UNKNOWN"}
                  </span>

                </td>


                {/* Actions */}

                <td className="px-6 py-4">

                  <div className="flex justify-end gap-2">

                    {/* View */}

                    <button
                      type="button"
                      onClick={() =>
                        onView(employee)
                      }
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      View
                    </button>


                    {/* Edit */}

                    {canEdit && (
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(employee)
                        }
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                      >
                        Edit
                      </button>
                    )}


                    {/* Delete - ADMIN ONLY */}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(employee)
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* =========================
          MOBILE CARDS
          ========================= */}

      <div className="space-y-3 p-4 md:hidden">

        {employees.map((employee) => (

          <div
            key={employee.id}
            className="rounded-lg border border-slate-200 p-4"
          >

            {/* Employee Header */}

            <div className="flex items-start justify-between gap-3">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">

                  {employee.firstName
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>


                <div>

                  <p className="font-semibold text-slate-800">

                    {employee.firstName}{" "}

                    {employee.lastName}

                  </p>

                  <p className="text-xs text-slate-400">
                    {employee.employeeCode}
                  </p>

                </div>

              </div>


              {/* Status */}

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                  employee.status
                )}`}
              >
                {employee.status || "UNKNOWN"}
              </span>

            </div>


            {/* Employee Information */}

            <div className="mt-4 grid grid-cols-2 gap-4">

              {/* Designation */}

              <div>

                <p className="text-xs text-slate-400">
                  Designation
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {employee.designation || "-"}
                </p>

              </div>


              {/* Department */}

              <div>

                <p className="text-xs text-slate-400">
                  Department
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {employee.departmentName || "-"}
                </p>

              </div>


              {/* Joining Date */}

              <div>

                <p className="text-xs text-slate-400">
                  Joining Date
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDate(
                    employee.joiningDate
                  )}
                </p>

              </div>


              {/* Email */}

              <div>

                <p className="text-xs text-slate-400">
                  Email
                </p>

                <p className="mt-1 truncate text-sm text-slate-700">
                  {employee.email || "-"}
                </p>

              </div>

            </div>


            {/* Actions */}

            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">

              {/* View */}

              <button
                type="button"
                onClick={() =>
                  onView(employee)
                }
                className="flex-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
              >
                View
              </button>


              {/* Edit */}

              {canEdit && (
                <button
                  type="button"
                  onClick={() =>
                    onEdit(employee)
                  }
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Edit
                </button>
              )}


              {/* Delete - ADMIN ONLY */}

              {canDelete && (
                <button
                  type="button"
                  onClick={() =>
                    onDelete(employee)
                  }
                  className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default EmployeeTable;