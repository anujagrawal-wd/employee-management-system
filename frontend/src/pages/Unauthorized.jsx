import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">

        <div className="text-6xl font-bold text-red-500">
          403
        </div>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Access Denied
        </h1>

        <p className="mt-2 text-slate-500">
          You don't have permission to access this page.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Go Back
        </button>

      </div>
    </div>
  );
}

export default Unauthorized;