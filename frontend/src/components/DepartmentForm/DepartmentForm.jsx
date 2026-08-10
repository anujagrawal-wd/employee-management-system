import { useEffect, useState } from "react";

import {
  createDepartment,
  updateDepartment,
  getDepartmentById,
} from "../../api/departmentApi";

function DepartmentForm({
  departmentId = null,
  onClose,
  onSuccess,
}) {
  const isEditMode = Boolean(departmentId);

  const [loading, setLoading] = useState(
    isEditMode
  );

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] =
    useState({});

  const [formData, setFormData] = useState({
    departmentCode: "",
    name: "",
    description: "",
  });


  /*
   * Load department when editing
   */

  useEffect(() => {
    if (!departmentId) {
      return;
    }

    const loadDepartment = async () => {
      try {
        setLoading(true);
        setError("");

        const department =
          await getDepartmentById(
            departmentId
          );

        setFormData({
          departmentCode:
            department.departmentCode || "",

          name:
            department.name || "",

          description:
            department.description || "",
        });

      } catch (error) {
        console.error(
          "Failed to load department:",
          error
        );

        setError(
          "Unable to load department details."
        );

      } finally {
        setLoading(false);
      }
    };

    loadDepartment();
  }, [departmentId]);


  /*
   * Handle input changes
   */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setError("");
  };


  /*
   * Submit form
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      const payload = {
        departmentCode:
          formData.departmentCode.trim(),

        name:
          formData.name.trim(),

        description:
          formData.description.trim(),
      };

      if (isEditMode) {
        await updateDepartment(
          departmentId,
          payload
        );
      } else {
        await createDepartment(
          payload
        );
      }

      onSuccess();

    } catch (error) {
      console.error(
        "Failed to save department:",
        error
      );

      if (
        error.response?.data?.errors
      ) {
        setFieldErrors(
          error.response.data.errors
        );

      } else if (
        error.response?.data?.message
      ) {
        setError(
          error.response.data.message
        );

      } else {
        setError(
          isEditMode
            ? "Unable to update department. Please try again."
            : "Unable to create department. Please try again."
        );
      }

    } finally {
      setSubmitting(false);
    }
  };


  /*
   * Loading state
   */

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

        <div className="rounded-2xl bg-white p-8 shadow-xl">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading department details...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              {isEditMode
                ? "Edit Department"
                : "Add New Department"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditMode
                ? "Update the department details below."
                : "Enter the department details below."}
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            ✕
          </button>

        </div>


        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          {/* General Error */}

          {error && (

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

            </div>

          )}


          {/* Department Code */}

          <div>

            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Department Code
            </label>

            <input
              type="text"
              name="departmentCode"
              value={
                formData.departmentCode
              }
              onChange={handleChange}
              placeholder="IT"
              maxLength={20}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {fieldErrors.departmentCode && (

              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.departmentCode}
              </p>

            )}

            <p className="mt-1 text-xs text-slate-400">
              Maximum 20 characters.
            </p>

          </div>


          {/* Department Name */}

          <div>

            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Department Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Information Technology"
              minLength={2}
              maxLength={100}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {fieldErrors.name && (

              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.name}
              </p>

            )}

          </div>


          {/* Description */}

          <div>

            <div className="flex items-center justify-between">

              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Description
              </label>

              <span className="text-xs text-slate-400">
                {formData.description.length}/500
              </span>

            </div>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              placeholder="Describe the department..."
              maxLength={500}
              rows={5}
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {fieldErrors.description && (

              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.description}
              </p>

            )}

          </div>


          {/* Buttons */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Department"
                  : "Add Department"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default DepartmentForm;