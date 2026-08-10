import { useEffect, useState } from "react";

import { getDashboardStatistics } from "../../api/dashboardApi";

import StatCard from "../../components/StatCard/StatCard";
import DepartmentStatistics from "../../components/DepartmentStatistics/DepartmentStatistics";
import RecentEmployees from "../../components/RecentEmployees/RecentEmployees";

function AdminDashboard() {
  const [statistics, setStatistics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
   * Load dashboard statistics
   */

  useEffect(() => {
    let cancelled = false;

    const loadStatistics = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getDashboardStatistics();

        if (cancelled) {
          return;
        }

        setStatistics(data);

      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load dashboard statistics:",
          error
        );

        setError(
          "Unable to load dashboard statistics."
        );

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadStatistics();

    return () => {
      cancelled = true;
    };
  }, []);


  /*
   * Loading
   */

  if (loading) {
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
   * Error
   */

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
            ⚠️
          </div>

          <h2 className="mt-4 font-semibold text-red-700">
            Dashboard Error
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="space-y-6">

      {/* =========================
          PAGE HEADER
          ========================= */}

      <div>

        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your employee management system.
        </p>

      </div>


      {/* =========================
          STATISTICS
          ========================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        {/* Total Employees */}

        <StatCard
          title="Total Employees"
          value={
            statistics?.totalEmployees ?? 0
          }
          description="Employees in the system"
        />


        {/* Active Employees */}

        <StatCard
          title="Active Employees"
          value={
            statistics?.activeEmployees ?? 0
          }
          description="Currently active"
          valueClassName="text-green-600"
        />


        {/* Inactive Employees */}

        <StatCard
          title="Inactive Employees"
          value={
            statistics?.inactiveEmployees ?? 0
          }
          description="Currently inactive"
          valueClassName="text-red-600"
        />


        {/* On Leave */}

        <StatCard
          title="On Leave"
          value={
            statistics?.onLeaveEmployees ?? 0
          }
          description="Employees currently on leave"
          valueClassName="text-amber-600"
        />


        {/* Terminated */}

        <StatCard
          title="Terminated"
          value={
            statistics?.terminatedEmployees ?? 0
          }
          description="Terminated employees"
          valueClassName="text-slate-600"
        />

      </div>


      {/* =========================
          DEPARTMENT STATISTICS
          ========================= */}

      <DepartmentStatistics />


      {/* =========================
          RECENT EMPLOYEES
          ========================= */}

      <RecentEmployees />

    </div>
  );
}

export default AdminDashboard;