import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const LogContext = createContext();

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const navigate = useNavigate();
  const { token, user } = useAuth();
  //const token = localStorage.getItem("token");
  //const user = localStorage.getItem("user");

  useEffect(() => {
    const fetchSources = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://127.0.0.1:8000/sources/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setSources(data);
          console.log("✅ Sources loaded:", data);
        } else {
          console.error("❌ Failed to load sources:", data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch sources:", err);
      }
    };
    fetchSources();
  }, [token]);

  // Fetch logs + WebSocket connection for selected source
  useEffect(() => {
    if (!selectedSource || !token) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/logs/history?source_id=${selectedSource.id}&limit=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setLogs(data.reverse());
          console.log("Loaded log history:", data);
        } else {
          console.error("❌ Failed to fetch logs:", data);
        }
      } catch (err) {
        console.error("❌ Error fetching logs:", err);
      }
    };

    fetchHistory();

    // WebSocket connection (per source)
    const ws = new WebSocket(`ws://127.0.0.1:8000/logs/ws?token=${token}`);

    ws.onopen = () => console.log("✅ Connected to WebSocket");
    ws.onmessage = (event) => {
      try {
        const log = JSON.parse(event.data);
        if (log.source_id === selectedSource.id) {
          setLogs((prev) => [...prev, log]);
        }
      } catch (e) {
        console.error("❌ Invalid WebSocket message", e);
      }
    };
    ws.onclose = () => console.warn("⚠️ WebSocket disconnected");
    ws.onerror = (err) => console.error("⚠️ WebSocket error:", err);

    return () => ws.close();
  }, [selectedSource, token]);

  return (
    <LogContext.Provider
      value={{
        logs,
        sources,
        setSources,
        selectedSource,
        setSelectedSource,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => useContext(LogContext);

