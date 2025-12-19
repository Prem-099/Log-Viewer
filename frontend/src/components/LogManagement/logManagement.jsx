import { useState } from "react";
import NavBar from "../Navbar";
import s from "../../styles/LogManager.module.css";
import { useLogs } from "../context/LogContext";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const LogManager = () => {
  const { sources } = useLogs();
  const { token } = useAuth();
  const [selectedSource, setSelectedSource] = useState("");
  const [format, setFormat] = useState("");
  const [customCount, setCustomCount] = useState("");

  //const token = localStorage.getItem("token");

  // Download logs
  const handleDownload = async () => {
    if (!selectedSource) {
      toast.error("Please select a source");
      return;
    }

    if (!format) {
      toast.error("Please select a format");
      return;
    }

    try {
      const url = `http://127.0.0.1:8000/logs/export?source_id=${selectedSource}&format=${format}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Download failed");
      }

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `logs_source_${selectedSource}.${format}`;
      link.click();

      toast.success("Logs downloaded successfully");
    } catch (err) {
      toast.error("Failed to download logs");
      console.error(err);
    }
  };

  return (
    <div className={s.pageWrapper}>
      <NavBar />
      <div className={s.container}>
        <header className={s.header}>
          <h1>Log Management Control</h1>
          <p>Export system data or perform maintenance on log history.</p>
        </header>

        <div className={s.grid}>
          {/* ================= EXPORT ================= */}
          <section className={s.card}>
            <h3>Export Logs</h3>
            <p className={s.description}>
              Download a local copy of your source activity.
            </p>

            <div className={s.controls}>
              {/* Source */}
              <select
                className={s.dropdown}
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
              >
                <option value="">Select Source</option>
                {sources.map((src) => (
                  <option key={src.id} value={src.id}>
                    {src.name}
                  </option>
                ))}
              </select>

              {/* Format */}
              <select
                className={s.dropdown}
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="">Select Format</option>
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (XLSX)</option>
              </select>

              <button className={s.primaryBtn} onClick={handleDownload}>
                Download
              </button>
            </div>
          </section>

          {/* ================= DELETE (future) ================= */}
          <section className={s.card}>
            <h3>Purge Logs</h3>
            <p className={s.description}>
              Permanently remove logs from the database.
            </p>

            <div className={s.controls}>
              <label>Quick Select:</label>
              <select className={s.dropdown}>
                <option value="def">Choose timeframe...</option>
                <option value="1hr">Last 1 hour</option>
                <option value="1d">Last 1 day</option>
                <option value="1week">Last 1 week</option>
                <option value="all">Everything</option>
              </select>
            </div>

            <div className={s.controls}>
              <label>Custom Count:</label>
              <input
                type="number"
                className={s.input}
                placeholder="e.g. 500"
                value={customCount}
                onChange={(e) => setCustomCount(e.target.value)}
              />
              <button className={s.deleteBtn}>Clear Logs</button>
            </div>

            <footer className={s.footerNote}>
              <span className={s.infoIcon}>ⓘ</span>
              Automatic cleanup is scheduled for 12:00 AM daily.
            </footer>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LogManager;
