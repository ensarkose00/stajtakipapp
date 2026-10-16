import { APPLICATION_STATUSES } from "../interfaces/application.js";
import Icon from "./Icons.jsx";

const statusStyles = {
  Bekliyor: "bg-amber-50 text-amber-700 ring-amber-600/15",
  "Kabul Edildi": "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Reddedildi: "bg-rose-50 text-rose-700 ring-rose-600/15",
};

/**
 * @param {{
 *   application: import("../interfaces/application.js").Application,
 *   onStatusChange: (id: string, status: import("../interfaces/application.js").ApplicationStatus) => void,
 *   onDelete: (id: string) => void
 * }} props
 */
export default function ApplicationCard({ application, onStatusChange, onDelete }) {
  const formattedDate = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${application.date}T00:00:00`));

  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
            <span className="text-lg font-bold">
              {application.company.slice(0, 1).toLocaleUpperCase("tr-TR")}
            </span>
          </div>
          <div className="min-w-0 pt-0.5">
            <h3 className="truncate font-bold text-slate-900">{application.company}</h3>
            <p className="mt-1 truncate text-sm text-slate-500">{application.position}</p>
          </div>
        </div>
        <button
          aria-label={`${application.company} kaydını sil`}
          className="rounded-lg p-2 text-slate-400 opacity-100 transition hover:bg-rose-50 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
          onClick={() => onDelete(application.id)}
          type="button"
        >
          <Icon name="trash" size={18} />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Icon name="calendar" size={16} className="text-slate-400" />
          <time dateTime={application.date}>{formattedDate}</time>
        </div>
        <label className="relative">
          <span className="sr-only">{application.company} başvuru durumu</span>
          <select
            className={`appearance-none rounded-full py-1.5 pl-3 pr-7 text-xs font-semibold ring-1 ring-inset outline-none transition focus:ring-2 focus:ring-emerald-600 ${statusStyles[application.status]}`}
            onChange={(event) =>
              onStatusChange(
                application.id,
                /** @type {import("../interfaces/application.js").ApplicationStatus} */ (
                  event.target.value
                ),
              )
            }
            value={application.status}
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <span aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px]">
            ▼
          </span>
        </label>
      </div>

      {application.notes && (
        <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">
          {application.notes}
        </p>
      )}
    </article>
  );
}
