import { useEffect, useState } from "react";
import { getEmployeeById } from "../../api/employeeApi";

function EmployeeDetailsModal({
  employeeId,
  onClose,
}) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadEmployee = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getEmployeeById(employeeId);

        if (cancelled) {
          return;
        }

        setEmployee(data);
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

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-700";

      case "ON_LEAVE":
        return "bg-amber-50 text-amber-700";

      case "TERMINATED":
        return "bg-red-50 text-red-700";

      case "INACTIVE":
        return "bg-slate-100 text-slate-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Employee Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View employee information
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            ✕
          </button>

        </div>


        {/* Content */}

        <div className="max-h-[70vh] overflow-y-auto p-6">

          {loading && (
            <div className="py-12 text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading employee details...
              </p>

            </div>
          )}


          {error && !loading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

            </div>
          )}


          {employee && !loading && !error && (
            <div className="space-y-6">

              {/* Employee Header */}

              <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-5 sm:flex-row sm:items-center">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">

                  {employee.firstName
                    ?.charAt(0)
                    ?.toUpperCase()}

                </div>

                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-3">

                    <h3 className="text-xl font-bold text-slate-900">

                      {employee.firstName}{" "}

                      {employee.lastName}

                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        employee.status
                      )}`}
                    >
                      {employee.status ||
                        "UNKNOWN"}
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {employee.designation ||
                      "-"}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Employee Code:{" "}
                    {employee.employeeCode ||
                      "-"}
                  </p>

                </div>

              </div>


              {/* Personal Information */}

              <div>

                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Personal Information
                </h3>

                <div className="grid gap-4 rounded-xl border border-slate-200 p-5 sm:grid-cols-2">

                  <div>
                    <p className="text-xs text-slate-400">
                      First Name
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {employee.firstName ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Last Name
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {employee.lastName ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Gender
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {employee.gender ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Employee Code
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {employee.employeeCode ||
                        "-"}
                    </p>
                  </div>

                </div>

              </div>


              {/* Contact Information */}

              <div>

                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Contact Information
                </h3>

                <div className="grid gap-4 rounded-xl border border-slate-200 p-5 sm:grid-cols-2">

                  <div>
                    <p className="text-xs text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-slate-800">
                      {employee.email ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {employee.phone ||
                        "-"}
                    </p>
                  </div>

                </div>

              </div>


              {/* Job Information */}

              <div>

                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Employment Information
                </h3>

                <div className="grid gap-4 rounded-xl border border-slate-200 p-5 sm:grid-cols-2">

                  <div>
                    <p className="text-xs text-slate-400">
                      Designation
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {employee.designation ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Department
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {employee.departmentName ||
                        "-"}
                    </p>

                    <p className="text-xs text-slate-400">
                      {employee.departmentCode ||
                        ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Joining Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {formatDate(
                        employee.joiningDate
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Salary
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      ₹{" "}
                      {employee.salary
                        ? Number(
                            employee.salary
                          ).toLocaleString(
                            "en-IN"
                          )
                        : "-"}
                    </p>
                  </div>

                </div>

              </div>


              {/* System Information */}

              <div>

                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  System Information
                </h3>

                <div className="grid gap-4 rounded-xl border border-slate-200 p-5 sm:grid-cols-2">

                  <div>
                    <p className="text-xs text-slate-400">
                      Employee ID
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      #{employee.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Department ID
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {employee.departmentId ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Created At
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {formatDateTime(
                        employee.createdAt
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Last Updated
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {formatDateTime(
                        employee.updatedAt
                      )}
                    </p>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>


        {/* Footer */}

        <div className="flex justify-end border-t border-slate-200 px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

export default EmployeeDetailsModal;