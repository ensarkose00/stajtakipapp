import { useCallback, useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import {
  APPLICATION_STATUSES,
  isApplicationList,
  STORAGE_KEY,
} from "./interfaces/application.js";

function readApplications() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (isApplicationList(parsed)) return parsed;

    console.error("Kaydedilmiş başvuru verileri beklenen biçimde değil.");
    return [];
  } catch (error) {
    console.error("Başvurular tarayıcı depolamasından okunamadı.", error);
    return [];
  }
}

/**
 * @param {import("./interfaces/application.js").Application[]} applications
 */
function persistApplications(applications) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

export default function App() {
  const [applications, setApplications] = useState(readApplications);
  const [storageError, setStorageError] = useState("");

  const commitApplications = useCallback((nextApplications) => {
    try {
      persistApplications(nextApplications);
      setApplications(nextApplications);
      setStorageError("");
      return true;
    } catch (error) {
      console.error("Başvurular tarayıcı depolamasına kaydedilemedi.", error);
      setStorageError(
        "Değişiklik kaydedilemedi. Tarayıcı depolama alanını kontrol edip tekrar dene.",
      );
      return false;
    }
  }, []);

  function addApplication(data) {
    const newApplication = {
      ...data,
      id: crypto.randomUUID(),
      status: "Bekliyor",
    };
    return commitApplications([newApplication, ...applications]);
  }

  function updateStatus(id, status) {
    if (!APPLICATION_STATUSES.includes(status)) return;
    commitApplications(
      applications.map((application) =>
        application.id === id ? { ...application, status } : application,
      ),
    );
  }

  function deleteApplication(id) {
    commitApplications(applications.filter((application) => application.id !== id));
  }

  return (
    <>
      {storageError && (
        <div
          className="fixed inset-x-4 top-4 z-[60] mx-auto max-w-xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 shadow-lg"
          role="alert"
        >
          {storageError}
        </div>
      )}
      <Dashboard
        applications={applications}
        onAdd={addApplication}
        onDelete={deleteApplication}
        onStatusChange={updateStatus}
      />
    </>
  );
}
