import { useEffect, useState } from "react";
import { getRecentEmployees } from "../../api/employeeApi";

function RecentEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadRecentEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRecentEmployees();

        if (cancelled) {
          return;
        }

        setEmployees(data || []);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load recent employees:",
          error
        );

        setError(
          "Unable to load recent employees."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRecentEmployees();

    return () => {
      cancelled = true;
    };
  }, []);


  /*
   * Format date
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
   * Status styling
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
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-center py-10">

          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

          <p className="ml-3 text-sm text-slate-500">
            Loading recent employees...
          </p>

        </div>

      </div>
    );
  }


  /*
   * Error
   */

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">

        <h2 className="font-semibold text-red-700">
          Recent Employees Error
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>

      </div>
    );
  }


  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* =========================
          HEADER
          ========================= */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

        <div>

          <h2 className="text-lg font-semibold text-slate-900">
            Recently Joined Employees
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest employees added to the organization.
          </p>

        </div>


        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
          {employees.length}
        </span>

      </div>


      {/* =========================
          EMPTY STATE
          ========================= */}

      {employees.length === 0 ? (

        <div className="p-8 text-center">

          <div className="text-2xl">
            👥
          </div>

          <p className="mt-2 text-sm text-slate-500">
            No employees found.
          </p>

        </div>

      ) : (

        <>
          {/* =========================
              DESKTOP TABLE
              ========================= */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Employee
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Designation
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Department
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Joining Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
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

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {employee.designation || "-"}
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
                        {employee.status ||
                          "UNKNOWN"}
                      </span>

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


                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                      employee.status
                    )}`}
                  >
                    {employee.status ||
                      "UNKNOWN"}
                  </span>

                </div>


                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

                  {/* Designation */}

                  <div>

                    <p className="text-xs text-slate-400">
                      Designation
                    </p>

                    <p className="mt-1 text-slate-700">
                      {employee.designation ||
                        "-"}
                    </p>

                  </div>


                  {/* Department */}

                  <div>

                    <p className="text-xs text-slate-400">
                      Department
                    </p>

                    <p className="mt-1 text-slate-700">
                      {employee.departmentName ||
                        "-"}
                    </p>

                  </div>


                  {/* Joining Date */}

                  <div>

                    <p className="text-xs text-slate-400">
                      Joining Date
                    </p>

                    <p className="mt-1 text-slate-700">
                      {formatDate(
                        employee.joiningDate
                      )}
                    </p>

                  </div>


                  {/* Department Code */}

                  <div>

                    <p className="text-xs text-slate-400">
                      Department Code
                    </p>

                    <p className="mt-1 text-slate-700">
                      {employee.departmentCode ||
                        "-"}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </>

      )}

    </div>
  );
}

export default RecentEmployees;