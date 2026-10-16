import Icon from "./Icons.jsx";

/**
 * @param {{ hasFilters: boolean, onAdd: () => void }} props
 */
export default function EmptyState({ hasFilters, onAdd }) {
  return (
    <div className="col-span-full flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
        <Icon name={hasFilters ? "search" : "briefcase"} size={28} />
      </div>
      <h3 className="text-lg font-bold text-slate-900">
        {hasFilters ? "Eşleşen kayıt bulunamadı" : "İlk başvurunu ekle"}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Arama kelimesini veya seçili filtreyi değiştirerek tekrar deneyebilirsin."
          : "Staj ve proje başvurularını tek bir yerde düzenli tutmaya başla."}
      </p>
      {!hasFilters && (
        <button
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          onClick={onAdd}
          type="button"
        >
          <Icon name="plus" size={18} />
          Başvuru ekle
        </button>
      )}
    </div>
  );
}
