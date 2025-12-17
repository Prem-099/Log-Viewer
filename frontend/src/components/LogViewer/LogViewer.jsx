import { useState, useEffect, useRef } from "react";
import { useLogs } from "../context/LogContext";
import styles from "./LogViewer.module.css";
import NavBar from "../Navbar";
import { toast } from "react-hot-toast";

const LogViewer = () => {
  const {
    logs,
    sources,
    selectedSource,
    setSelectedSource,
  } = useLogs();

  const [levelFilter, setLevelFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("");
  const containerRef = useRef(null);

  //  Scroll to bottom whenever new logs arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const levelMatch = levelFilter === "all" || log.level === levelFilter;
    const sourceMatch =
      !sourceFilter.trim() ||
      log.source?.toLowerCase().includes(sourceFilter.toLowerCase());
    return levelMatch && sourceMatch;
  });

  // Clear all filters
  const handleClearFilters = () => {
    setLevelFilter("all");
    setSourceFilter("");
  };

  // Handle source (app) selection
  const handleSourceChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selected = sources.find((s) => s.id === selectedId);
    if (selected) {
      setSelectedSource(selected);
      toast.success(`Selected App: ${selected.name}`);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <h2 className={styles.title}>📜 Real-Time Logs</h2>

        {/*  Filters & Source Selector */}
        <div className={styles.filters}>
          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className={styles.dropdown}
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>

          {/* Source Text Filter */}
          <input
            type="text"
            placeholder="Filter by source..."
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className={styles.input}
          />

          <button onClick={handleClearFilters} className={styles.clearButton}>
            Clear
          </button>

          {/* App Selector */}
          <select
            className={styles.source_drop}
            onChange={handleSourceChange}
            value={selectedSource?.id || ""}
          >
            <option value="">Select App Source</option>
            {sources.map((src) => (
              <option key={src.id} value={src.id}>
                {src.name}
              </option>
            ))}
          </select>
        </div>

        {/* Log List */}
        <div ref={containerRef} className={styles.logList}>
          {!selectedSource ? (
            <p className={styles.noLogs}>Please select a source to view logs.</p>
          ) : filteredLogs.length === 0 ? (
            <p className={styles.noLogs}>No logs match the filters.</p>
          ) : (
            filteredLogs.map((log, index) => (
              <div
                key={index}
                className={`${styles.logCard} ${styles[log.level]}`}
              >
                <span className={styles.timestamp}>
                  {formatTimestamp(log.timestamp)}
                </span>
                <span className={styles.source}>{log.source}</span>
                <span className={styles.level}>[{log.level.toUpperCase()}]</span>
                <span className={styles.message}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default LogViewer;
