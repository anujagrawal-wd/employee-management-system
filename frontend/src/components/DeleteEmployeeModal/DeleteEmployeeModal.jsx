function DeleteEmployeeModal({
  employee,
  deleting,
  onCancel,
  onConfirm,
}) {
  if (!employee) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-xl">
              ⚠️
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Delete Employee?
              </h2>

              <p className="text-sm text-slate-500">
                This action cannot be undone.
              </p>

            </div>

          </div>

        </div>


        {/* Content */}

        <div className="px-6 py-5">

          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to delete
            {" "}

            <span className="font-semibold text-slate-900">
              {employee.firstName}{" "}
              {employee.lastName}
            </span>

            ?

          </p>


          <div className="mt-4 rounded-lg bg-slate-50 p-4">

            <div className="grid grid-cols-2 gap-3 text-sm">

              <div>

                <p className="text-xs text-slate-400">
                  Employee Code
                </p>

                <p className="font-medium text-slate-700">
                  {employee.employeeCode}
                </p>

              </div>


              <div>

                <p className="text-xs text-slate-400">
                  Department
                </p>

                <p className="font-medium text-slate-700">
                  {employee.departmentName}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* Buttons */}

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>


          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting
              ? "Deleting..."
              : "Delete Employee"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeleteEmployeeModal;