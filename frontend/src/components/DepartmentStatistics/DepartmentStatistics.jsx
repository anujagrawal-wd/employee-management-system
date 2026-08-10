import { useEffect, useState } from "react";
import { getDepartmentStatistics } from "../../api/departmentApi";

function DepartmentStatistics() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDepartmentStatistics = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDepartmentStatistics();

        if (cancelled) {
          return;
        }

        setDepartments(data || []);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load department statistics:",
          error
        );

        setError(
          "Unable to load department statistics."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDepartmentStatistics();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Loading
   */

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Employees by Department
        </h2>

        <div className="mt-6 flex items-center justify-center py-8">

          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

          <p className="ml-3 text-sm text-slate-500">
            Loading department statistics...
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
          Department Statistics Error
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>

      </div>
    );
  }

  /*
   * Find largest department
   * for progress-bar scaling.
   */

  const maxEmployeeCount = Math.max(
    ...departments.map(
      (department) =>
        Number(department.employeeCount) || 0
    ),
    1
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div>

        <h2 className="text-lg font-semibold text-slate-900">
          Employees by Department
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution of employees across departments.
        </p>

      </div>


      {/* Empty State */}

      {departments.length === 0 ? (

        <div className="mt-6 rounded-lg bg-slate-50 p-6 text-center">

          <div className="text-2xl">
            🏢
          </div>

          <p className="mt-2 text-sm text-slate-500">
            No department data available.
          </p>

        </div>

      ) : (

        <div className="mt-6 space-y-5">

          {departments.map((department) => {

            const employeeCount =
              Number(
                department.employeeCount
              ) || 0;

            const percentage =
              (employeeCount /
                maxEmployeeCount) *
              100;

            return (
              <div
                key={
                  department.departmentCode
                }
              >

                {/* Department Header */}

                <div className="mb-2 flex items-center justify-between">

                  <div>

                    <p className="text-sm font-semibold text-slate-800">
                      {
                        department.departmentName
                      }
                    </p>

                    <p className="text-xs text-slate-400">
                      {
                        department.departmentCode
                      }
                    </p>

                  </div>

                  <span className="text-sm font-bold text-slate-700">
                    {employeeCount}
                  </span>

                </div>


                {/* Progress Bar */}

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default DepartmentStatistics;