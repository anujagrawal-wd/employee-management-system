import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login/Login";
import Unauthorized from "../pages/Unauthorized";

import AdminDashboard from "../pages/admin/Dashboard";
import HrDashboard from "../pages/hr/Dashboard";
import EmployeeDashboard from "../pages/employee/Dashboard";

import Employees from "../pages/admin/Employees";
import Departments from "../pages/admin/Departments";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";

import Profile from "../pages/Profile/Profile";
import Users from "../pages/admin/Users";

function AppRoutes() {
  return (
    <Routes>

      {/* ========================================
          PUBLIC ROUTES
          ======================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />


      {/* ========================================
          DASHBOARD LAYOUT
          ======================================== */}

      <Route element={<DashboardLayout />}>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "HR",
                "EMPLOYEE",
              ]}
            />
          }
        >
          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>


        {/* ======================================
            ADMIN DASHBOARD
            ADMIN ONLY
            ====================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            />
          }
        >

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<Users />}
          />

        </Route>


        {/* ======================================
            HR DASHBOARD
            HR ONLY
            ====================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["HR"]}
            />
          }
        >

          <Route
            path="/hr/dashboard"
            element={<HrDashboard />}
          />

        </Route>


        {/* ======================================
            EMPLOYEE DASHBOARD
            EMPLOYEE ONLY
            ====================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["EMPLOYEE"]}
            />
          }
        >

          <Route
            path="/employee/dashboard"
            element={<EmployeeDashboard />}
          />

        </Route>


        {/* ======================================
            EMPLOYEES MANAGEMENT
            ADMIN + HR
            ====================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN", "HR"]}
            />
          }
        >

          <Route
            path="/employees"
            element={<Employees />}
          />

        </Route>


        {/* ======================================
            DEPARTMENTS MANAGEMENT
            ADMIN + HR
            ====================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN", "HR"]}
            />
          }
        >

          <Route
            path="/departments"
            element={<Departments />}
          />

        </Route>


      </Route>


      {/* ========================================
          UNKNOWN ROUTES
          ======================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default AppRoutes;