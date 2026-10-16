import { useMemo, useState } from "react";
import ApplicationCard from "../components/ApplicationCard.jsx";
import ApplicationForm from "../components/ApplicationForm.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Icon from "../components/Icons.jsx";
import { APPLICATION_STATUSES } from "../interfaces/application.js";

const filters = ["Tümü", ...APPLICATION_STATUSES];

/**
 * @param {{
 *   applications: import("../interfaces/application.js").Application[],
 *   onAdd: (data: Omit<import("../interfaces/application.js").Application, "id" | "status">) => boolean,
 *   onStatusChange: (id: string, status: import("../interfaces/application.js").ApplicationStatus) => void,
 *   onDelete: (id: string) => void
 * }} props
 */
export default function Dashboard({
  applications,
  onAdd,
  onStatusChange,
  onDelete,
}) {
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const counts = useMemo(
    () => ({
      total: applications.length,
      waiting: applications.filter((item) => item.status === "Bekliyor").length,
      accepted: applications.filter((item) => item.status === "Kabul Edildi").length,
      rejected: applications.filter((item) => item.status === "Reddedildi").length,
    }),
    [applications],
  );

  const visibleApplications = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("tr-TR");
    return [...applications]
      .filter((item) => activeFilter === "Tümü" || item.status === activeFilter)
      .filter(
        (item) =>
          !query ||
          `${item.company} ${item.position} ${item.notes ?? ""}`
            .toLocaleLowerCase("tr-TR")
            .includes(query),
      )
      .sort((first, second) => second.date.localeCompare(first.date));
  }, [activeFilter, applications, search]);

  function handleAdd(data) {
    if (onAdd(data)) setFormOpen(false);
  }

  function exportToCSV() {
    const headers = ["ID", "Şirket / Kurum", "Pozisyon / Proje", "Durum", "Tarih", "Not"];
    const rows = applications.map((application) => [
      application.id,
      application.company,
      application.position,
      application.status,
      application.date,
      application.notes ?? "",
    ]);
    const escapeCSV = (value) =>
      `"${String(value).replaceAll('"', '""')}"`;
    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "basvurularim.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const summaryCards = [
    { label: "Toplam başvuru", value: counts.total, mark: "bg-slate-900" },
    { label: "Yanıt bekliyor", value: counts.waiting, mark: "bg-amber-500" },
    { label: "Kabul edildi", value: counts.accepted, mark: "bg-emerald-600" },
    { label: "Olumsuz yanıt", value: counts.rejected, mark: "bg-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50/70 via-slate-50 to-slate-50">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a aria-label="Pano ana sayfa" className="flex items-center gap-3" href="#">
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-md shadow-emerald-900/15">
              <Icon name="briefcase" size={21} />
            </span>
            <span>
              <span className="block text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">
                Başvuru Panosu
              </span>
              <span className="hidden text-xs text-slate-500 sm:block">
                Kariyer yolculuğun burada
              </span>
            </span>
          </a>
          <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 sm:inline-flex">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Kişisel takip alanın
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <section className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold text-emerald-800">
              Merhaba, hoş geldin
            </p>
            <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Hedeflerine giden yolu
              <span className="text-emerald-700"> takip et.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Staj ve proje başvurularını düzenle, süreçteki her gelişmeden haberdar ol.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-700 bg-white px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-700/15 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={applications.length === 0}
              onClick={exportToCSV}
              type="button"
            >
              <Icon name="download" size={18} />
              Dışa aktar
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
              onClick={() => setFormOpen(true)}
              type="button"
            >
              <Icon name="plus" size={19} />
              Yeni başvuru
            </button>
          </div>
        </section>

        <section aria-label="Başvuru özeti" className="mt-9 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5"
              key={card.label}
            >
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${card.mark}`} />
                <p className="text-xs font-semibold text-slate-500 sm:text-sm">{card.label}</p>
              </div>
              <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Başvurularım</h2>
              <p className="mt-1 text-sm text-slate-500">
                {counts.total} kayıt · En yeni başvuru en üstte
              </p>
            </div>
            <label className="relative block w-full md:max-w-xs">
              <span className="sr-only">Başvurularda ara</span>
              <Icon
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                name="search"
                size={18}
              />
              <input
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Şirket veya pozisyon ara"
                type="search"
                value={search}
              />
            </label>
          </div>

          <div aria-label="Duruma göre filtrele" className="flex gap-2 overflow-x-auto py-4">
            {filters.map((filter) => {
              const selected = activeFilter === filter;
              return (
                <button
                  aria-pressed={selected}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                    selected
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
                  }`}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                >
                  {filter}
                  {filter === "Tümü" && (
                    <span className="ml-2 opacity-70">{counts.total}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleApplications.length > 0 ? (
              visibleApplications.map((application) => (
                <ApplicationCard
                  application={application}
                  key={application.id}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))
            ) : (
              <EmptyState
                hasFilters={applications.length > 0}
                onAdd={() => setFormOpen(true)}
              />
            )}
          </div>
        </section>

        <footer className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
          <p>Verilerin yalnızca bu tarayıcıda saklanır.</p>
          <p className="inline-flex items-center gap-1">
            Her adım, hedefine biraz daha yakın <Icon name="arrow" size={14} />
          </p>
        </footer>
      </main>

      {formOpen && (
        <ApplicationForm onClose={() => setFormOpen(false)} onSubmit={handleAdd} />
      )}
    </div>
  );
}
