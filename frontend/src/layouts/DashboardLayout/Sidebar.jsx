import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


function Sidebar({ isOpen, onClose }) {

  const { user } = useAuth();

  const role = user?.role;


  /*
   * =========================================
   * NAVIGATION LINK STYLES
   * =========================================
   */

  const linkClasses = ({ isActive }) =>
    `flex items-center rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;


  /*
   * =========================================
   * DASHBOARD PATH
   * =========================================
   */

  const dashboardPath =
    role === "ADMIN"
      ? "/admin/dashboard"
      : role === "HR"
        ? "/hr/dashboard"
        : "/employee/dashboard";


  return (
    <>

      {/* =====================================
          MOBILE OVERLAY
          ===================================== */}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}


      {/* =====================================
          SIDEBAR
          ===================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col
          border-r border-slate-200 bg-white
          transform transition-transform duration-300
          lg:static lg:flex lg:translate-x-0
          ${isOpen
            ? "translate-x-0"
            : "-translate-x-full"}
        `}
      >

        {/* ===================================
            LOGO
            =================================== */}

        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">

          <div>

            <h1 className="text-xl font-bold text-slate-900">
              EMS
            </h1>

            <p className="text-xs text-slate-400">
              Employee Management
            </p>

          </div>


          {/* Mobile Close Button */}

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>

        </div>


        {/* ===================================
            NAVIGATION
            =================================== */}

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">


          {/* Dashboard */}

          <NavLink
            to={dashboardPath}
            className={linkClasses}
            onClick={onClose}
          >
            Dashboard
          </NavLink>


          {/* =================================
              ADMIN ONLY
              USER MANAGEMENT
              ================================= */}

          {role === "ADMIN" && (
            <NavLink
              to="/admin/users"
              className={linkClasses}
              onClick={onClose}
            >
              User Management
            </NavLink>
          )}


          {/* =================================
              ADMIN + HR
              EMPLOYEES
              ================================= */}

          {(role === "ADMIN" || role === "HR") && (
            <NavLink
              to="/employees"
              className={linkClasses}
              onClick={onClose}
            >
              Employees
            </NavLink>
          )}


          {/* =================================
              ADMIN + HR
              DEPARTMENTS
              ================================= */}

          {(role === "ADMIN" || role === "HR") && (
            <NavLink
              to="/departments"
              className={linkClasses}
              onClick={onClose}
            >
              Departments
            </NavLink>
          )}


          {/* =================================
              ALL ROLES
              PROFILE
              ================================= */}

          <NavLink
            to="/profile"
            className={linkClasses}
            onClick={onClose}
          >
            My Profile
          </NavLink>

        </nav>


        {/* ===================================
            LOGGED-IN ROLE
            =================================== */}

        <div className="border-t border-slate-200 p-4">

          <div className="rounded-lg bg-slate-50 p-3">

            <p className="text-xs text-slate-400">
              Logged in as
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {role || "USER"}
            </p>

          </div>

        </div>

      </aside>

    </>
  );
}


export default Sidebar;