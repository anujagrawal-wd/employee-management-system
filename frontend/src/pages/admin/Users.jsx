import { useEffect, useState } from "react";

import {
  getAllUsers,
  createUser,
  updateUserStatus,
} from "../../api/userApi";


function Users() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });


  /*
   * =========================================
   * LOAD USERS
   * =========================================
   */

  const loadUsers = async () => {

    try {

      setLoading(true);

      const data = await getAllUsers();

      setUsers(data || []);

      setError("");

    } catch (error) {

      console.error(
        "Failed to load users:",
        error
      );

      setError(
        "Unable to load users."
      );

    } finally {

      setLoading(false);

    }
  };


  /*
   * =========================================
   * INITIAL LOAD
   * =========================================
   */

  useEffect(() => {

    let cancelled = false;

    const fetchUsers = async () => {

      try {

        const data = await getAllUsers();

        if (cancelled) {
          return;
        }

        setUsers(data || []);
        setError("");

      } catch (error) {

        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load users:",
          error
        );

        setError(
          "Unable to load users."
        );

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }
    };


    fetchUsers();


    return () => {
      cancelled = true;
    };

  }, []);


  /*
   * =========================================
   * FORM CHANGE
   * =========================================
   */

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

  };


  /*
   * =========================================
   * CREATE USER
   * =========================================
   */

  const handleCreateUser = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {

      setError(
        "Please fill in all required fields."
      );

      return;
    }


    if (form.password.length < 8) {

      setError(
        "Password must be at least 8 characters."
      );

      return;
    }


    try {

      setSaving(true);


      await createUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });


      setSuccess(
        `${form.role} account created successfully.`
      );


      setForm({
        name: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
      });


      setShowForm(false);


      await loadUsers();

    } catch (error) {

      console.error(
        "Failed to create user:",
        error
      );


      const message =
        error?.response?.data;


      if (typeof message === "string") {

        setError(message);

      } else if (
        message?.message
      ) {

        setError(message.message);

      } else {

        setError(
          "Unable to create user."
        );

      }

    } finally {

      setSaving(false);

    }

  };


  /*
   * =========================================
   * ENABLE / DISABLE USER
   * =========================================
   */

  const handleStatusChange = async (user) => {

    try {

      setError("");
      setSuccess("");


      await updateUserStatus(
        user.id,
        !user.enabled
      );


      setSuccess(
        user.enabled
          ? "User disabled successfully."
          : "User enabled successfully."
      );


      await loadUsers();

    } catch (error) {

      console.error(
        "Failed to update user status:",
        error
      );


      const message =
        error?.response?.data;


      if (typeof message === "string") {

        setError(message);

      } else if (
        message?.message
      ) {

        setError(message.message);

      } else {

        setError(
          "Unable to update user status."
        );

      }

    }

  };


  /*
   * =========================================
   * DATE FORMAT
   * =========================================
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
   * =========================================
   * ROLE STYLE
   * =========================================
   */

  const getRoleClass = (role) => {

    if (role === "ADMIN") {

      return "bg-purple-50 text-purple-700";

    }

    if (role === "HR") {

      return "bg-blue-50 text-blue-700";

    }

    return "bg-green-50 text-green-700";

  };


  /*
   * =========================================
   * UI
   * =========================================
   */

  return (

    <div className="space-y-6">

      {/* =====================================
          HEADER
          ===================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            User Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage HR and employee accounts.
          </p>

        </div>


        <button
          type="button"
          onClick={() => {

            setShowForm(true);
            setError("");
            setSuccess("");

          }}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Create User
        </button>

      </div>


      {/* =====================================
          SUCCESS
          ===================================== */}

      {success && (

        <div className="rounded-xl border border-green-200 bg-green-50 p-4">

          <p className="text-sm font-medium text-green-700">
            {success}
          </p>

        </div>

      )}


      {/* =====================================
          ERROR
          ===================================== */}

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

        </div>

      )}


      {/* =====================================
          CREATE USER FORM
          ===================================== */}

      {showForm && (

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Create User
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create an HR or Employee account.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setShowForm(false)
              }
              className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
            >
              ✕
            </button>

          </div>


          <form
            onSubmit={handleCreateUser}
            className="mt-6 grid gap-5 sm:grid-cols-2"
          >

            {/* Name */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* Password */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* Role */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role
              </label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="EMPLOYEE">
                  Employee
                </option>

                <option value="HR">
                  HR
                </option>

              </select>

            </div>


            {/* Buttons */}

            <div className="flex gap-3 sm:col-span-2">

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Creating..."
                  : "Create User"}
              </button>


              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* =====================================
          USERS TABLE
          ===================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            System Users
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {users.length} user
            {users.length !== 1
              ? "s"
              : ""}{" "}
            registered in the system.
          </p>

        </div>


        {loading ? (

          <div className="p-8 text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading users...
            </p>

          </div>

        ) : users.length === 0 ? (

          <div className="p-8 text-center">

            <p className="text-sm text-slate-500">
              No users found.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Created
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {users.map((user) => (

                  <tr
                    key={user.id}
                    className="hover:bg-slate-50"
                  >

                    {/* User */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">

                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}

                        </div>

                        <div>

                          <p className="text-sm font-semibold text-slate-800">
                            {user.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {user.email}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Role */}

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleClass(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>

                    </td>


                    {/* Status */}

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          user.enabled
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {user.enabled
                          ? "ACTIVE"
                          : "DISABLED"}
                      </span>

                    </td>


                    {/* Created */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(
                        user.createdAt
                      )}
                    </td>


                    {/* Action */}

                    <td className="px-6 py-4 text-right">

                      {user.role === "ADMIN" ? (

                        <span className="text-xs font-medium text-slate-400">
                          Protected
                        </span>

                      ) : (

                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              user
                            )
                          }
                          className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                            user.enabled
                              ? "border-red-200 text-red-600 hover:bg-red-50"
                              : "border-green-200 text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {user.enabled
                            ? "Disable"
                            : "Enable"}
                        </button>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}


export default Users;