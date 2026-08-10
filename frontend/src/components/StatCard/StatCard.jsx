function StatCard({
  title,
  value,
  description,
  valueClassName = "text-slate-900",
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${valueClassName}`}
      >
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs text-slate-400">
          {description}
        </p>
      )}

    </div>
  );
}

export default StatCard;