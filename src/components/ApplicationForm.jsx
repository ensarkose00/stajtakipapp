import { useState } from "react";
import Icon from "./Icons.jsx";

const initialForm = {
  company: "",
  position: "",
  date: new Date().toLocaleDateString("en-CA"),
  notes: "",
};

/**
 * @param {{ onClose: () => void, onSubmit: (form: typeof initialForm) => void }} props
 */
export default function ApplicationForm({ onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      company: form.company.trim(),
      position: form.position.trim(),
      date: form.date,
      notes: form.notes.trim(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="form-title"
        aria-modal="true"
        className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8"
        role="dialog"
      >
        <div className="mb-7 flex items-start justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Yeni kayıt
            </p>
            <h2 id="form-title" className="text-2xl font-bold tracking-tight text-slate-900">
              Başvurunu ekle
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Takip etmek istediğin staj veya proje bilgilerini gir.
            </p>
          </div>
          <button
            aria-label="Formu kapat"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Şirket / kurum adı
            </span>
            <input
              autoFocus
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              maxLength={80}
              name="company"
              onChange={handleChange}
              placeholder="Örn. Pusula Teknoloji"
              required
              value={form.company}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Pozisyon / proje
            </span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              maxLength={100}
              name="position"
              onChange={handleChange}
              placeholder="Örn. Frontend Geliştirici Stajyeri"
              required
              value={form.position}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Başvuru tarihi
            </span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              name="date"
              onChange={handleChange}
              required
              type="date"
              value={form.date}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Not <span className="font-normal text-slate-400">(isteğe bağlı)</span>
            </span>
            <textarea
              className="min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              maxLength={300}
              name="notes"
              onChange={handleChange}
              placeholder="Başvuruyla ilgili kısa bir not..."
              value={form.notes}
            />
          </label>

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <button
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              onClick={onClose}
              type="button"
            >
              Vazgeç
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-700/20"
              type="submit"
            >
              <Icon name="plus" size={18} />
              Kaydı ekle
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
