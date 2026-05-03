function StatCard({ label, value, tone = 'blue', icon: Icon }) {
  const tones = {
    blue: 'from-blue-500/25 to-cyan-500/10 text-blue-200 ring-blue-400/20',
    green: 'from-emerald-500/25 to-teal-500/10 text-emerald-200 ring-emerald-400/20',
    amber: 'from-amber-500/25 to-orange-500/10 text-amber-200 ring-amber-400/20',
    red: 'from-rose-500/25 to-red-500/10 text-rose-200 ring-rose-400/20',
  };

  return (
    <section className={`min-h-36 rounded-xl bg-gradient-to-br ${tones[tone]} p-6 ring-1 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/30`}>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-gray-300">{label}</p>
        {Icon && (
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950/40">
            <Icon size={20} strokeWidth={2.3} />
          </span>
        )}
      </div>
      <p className="mt-6 text-4xl font-semibold text-white">{value}</p>
    </section>
  );
}

export default StatCard;
