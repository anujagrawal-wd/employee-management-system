function DepartmentTable({
  departments,
  loading,
  onEdit,
  onDelete,
  onViewEmployees,
}) {
  /*
   * Status styling
   */

  const getStatusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-600";

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
            Loading departments...
          </p>

        </div>

      </div>
    );
  }


  /*
   * Empty state
   */

  if (
    !departments ||
    departments.length === 0
  ) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">

        <div className="text-3xl">
          🏢
        </div>

        <h3 className="mt-3 font-semibold text-slate-800">
          No departments found
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Add a department to get started.
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
                Department
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Description
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

            {departments.map(
              (department) => (

                <tr
                  key={department.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* Department */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600">
                        {department.departmentCode
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          {department.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {department.departmentCode}
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* Description */}

                  <td className="px-6 py-4">

                    <p className="max-w-md text-sm text-slate-600">
                      {department.description ||
                        "-"}
                    </p>

                  </td>


                  {/* Status */}

                  <td className="px-6 py-4">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        department.status
                      )}`}
                    >
                      {department.status ||
                        "UNKNOWN"}
                    </span>

                  </td>


                  {/* Actions */}

                  <td className="px-6 py-4">

                    <div className="flex justify-end gap-2">

                      {/* View Employees */}

                      <button
                        type="button"
                        onClick={() =>
                          onViewEmployees(
                            department
                          )
                        }
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                      >
                        View Employees
                      </button>


                      {/* Edit */}

                      {onEdit && (
                        <button
                          type="button"
                          onClick={() =>
                            onEdit(
                              department
                            )
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>
                      )}


                      {/* Delete - ADMIN ONLY */}

                      {onDelete && (
                        <button
                          type="button"
                          onClick={() =>
                            onDelete(
                              department
                            )
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      )}

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>


      {/* =========================
          MOBILE CARDS
          ========================= */}

      <div className="space-y-3 p-4 md:hidden">

        {departments.map(
          (department) => (

            <div
              key={department.id}
              className="rounded-lg border border-slate-200 p-4"
            >

              {/* Header */}

              <div className="flex items-start justify-between gap-3">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600">
                    {department.departmentCode
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div>

                    <p className="font-semibold text-slate-800">
                      {department.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {department.departmentCode}
                    </p>

                  </div>

                </div>


                {/* Status */}

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                    department.status
                  )}`}
                >
                  {department.status ||
                    "UNKNOWN"}
                </span>

              </div>


              {/* Description */}

              <div className="mt-4">

                <p className="text-xs text-slate-400">
                  Description
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {department.description ||
                    "-"}
                </p>

              </div>


              {/* Actions */}

              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">

                {/* View Employees */}

                <button
                  type="button"
                  onClick={() =>
                    onViewEmployees(
                      department
                    )
                  }
                  className="flex-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  View Employees
                </button>


                {/* Edit */}

                {onEdit && (
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(
                        department
                      )
                    }
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    Edit
                  </button>
                )}


                {/* Delete */}

                {onDelete && (
                  <button
                    type="button"
                    onClick={() =>
                      onDelete(
                        department
                      )
                    }
                    className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                )}

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
}

export default DepartmentTable;