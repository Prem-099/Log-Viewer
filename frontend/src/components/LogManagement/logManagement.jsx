import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import NavBar from "../Navbar";
import s from "../../styles/LogManager.module.css";

const LogManager = () => {
  const [customCount, setCustomCount] = useState("");

  return (
    <div className={s.pageWrapper}>
      <NavBar />
      <div className={s.container}>
        <header className={s.header}>
          <h1>Log Management Control</h1>
          <p>Export system data or perform maintenance on log history.</p>
        </header>

        <div className={s.grid}>
          {/* Export Section */}
          <section className={s.card}>
            <h3>Export Logs</h3>
            <p className={s.description}>Download a local copy of your source activity.</p>
            <div className={s.controls}>
              <select className={s.dropdown}>
                <option value="def">Select Format</option>
                <option value="csv">CSV Document</option>
                <option value="excel">Excel Spreadsheet (XLSX)</option>
                <option value="json">JSON Raw Data</option>
              </select>
              <button className={s.primaryBtn}>Download</button>
            </div>
          </section>

          {/* Delete Section */}
          <section className={s.card}>
            <h3>Purge Logs</h3>
            <p className={s.description}>Permanently remove logs from the database.</p>
            
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