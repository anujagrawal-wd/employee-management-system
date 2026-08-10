import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">

      {/* Left Side */}

      <div className="flex items-center gap-3">

        {/* Mobile Menu Button */}

        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Employee Management System
          </h2>

          <p className="hidden text-xs text-slate-400 sm:block">
            Manage your workforce efficiently
          </p>
        </div>

      </div>

      {/* Right Side */}

      <div className="flex items-center gap-3 sm:gap-4">

        {/* User Information */}

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">
            {user?.name}
          </p>

          <p className="text-xs text-slate-400">
            {user?.role}
          </p>
        </div>

        {/* Avatar */}

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;