import { useState } from "react";
import { useLogs } from "../context/LogContext";
import { useAuth } from "../context/AuthContext";
import NavBar from "../Navbar";
import toast from "react-hot-toast";
import axios from "axios";
import s from "../../styles/SourceRegister.module.css";

const SourceManagement = () => {
  const { sources, setSources } = useLogs();
  const [sourcename, setSourcename] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showList, setShowList] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const {token} = useAuth();

  const handleRegister = async (e) => {
  e.preventDefault();

  try {
    if (!sourcename || !sourcename.trim()) return toast.error("Source name is required");
    if (!token) return toast.error("Login required");
    const trimmedname = sourcename.trim();
    setAdding(true);

    const res = await axios.post(
      "http://127.0.0.1:8000/sources/register",
      { name: trimmedname, token : token},
      { headers: { "Content-Type": "application/json" } }
    );

    //console.log("Axios response:", res);

    const data = res.data;

    if (data?.source_id && data?.api_key) {
      toast.success("Source registered");
      setResponseData(data);
      setSourcename("");
      setSources((prev) => [...prev, data]);
    } else {
      toast.error("Unexpected response from server");
    }
  } catch (err) {
    console.error(" Top-level error:", err);
    toast.error(err?.response?.data?.detail || err.message || "Registration failed");
  } finally {
    setAdding(false);
  }
};

  const handleDelete = async (sourceId) => {
    
    if (!token) return toast.error("Login required");
    
    setDeleting(true);
    setDeletingId(sourceId);

    try {
      await axios.post("http://127.0.0.1:8000/sources/delete",{
        source_id : sourceId, token: token
      },{
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Source deleted");
      setSources((prev) => prev.filter((s) => s.id !== sourceId));
    } catch (err) {
      toast.error("Failed to delete source");
    } finally{
      setDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className={s.pagewrapper}>

        <NavBar />
        <div className={s.container}>
          <h2>Source Management</h2>

          {/* Add Source Dropdown */}
          <div className={s.dropdown}>
            <button onClick={() => setShowAdd(!showAdd)} className={s.dropdown_btn}>
              {showAdd ? "⬆ Hide Add Source" : "⬇ Add Source"}
            </button>
            {showAdd && (
              <form onSubmit={handleRegister} className={s.form}>
                <input
                  className={s.source_input}
                  type="text"
                  placeholder="Enter source name"
                  value={sourcename}
                  onChange={(e) => setSourcename(e.target.value)}
                  required
                />
                <button
                  className={s.submit_btn}
                  type="submit"
                  disabled={adding || !sourcename}
                >
                  {adding ? <>Adding <span className={s.spinner}></span></> : "Add"}
                </button>
                {responseData && (
                  <div className={s.responseBox}>
                      <h3>Source Registered Successfully!</h3>
                      <p><strong>Source ID:</strong> {responseData.source_id}</p>
                      <p className={s.api_key}><strong>API Key:</strong> {responseData.api_key}</p>
                      <button
                      onClick={() => {
                          navigator.clipboard.writeText(responseData.api_key);
                          toast.success("API key copied!");
                      }}
                      className={s.copyBtn}
                      >
                      Copy API Key
                      </button>
                      <p className={s.note}>Note: API Key will be shown only once. Store it securely.</p>
                  </div>
                  )}
              </form>
            )}
          </div>

          {/* Delete Source Dropdown */}
          <div className={s.dropdown}>
            <button onClick={() => setShowDelete(!showDelete)} className={s.dropdown_btn}>
              {showDelete ? "⬆ Hide Delete Source" : "⬇ Delete Source"}
            </button>
            {showDelete && (
              <div className={s.source_list}>
                {sources.length === 0 ? (
                  <p style={{color: "grey"}}>No sources to delete.</p>
                ) : (
                  <ul>
                    {sources.map((source) => (
                      <li key={source.id} className={s.source_item}>
                        <span>{source.name}</span>
                        <button
                          className={s.delete_btn}
                          onClick={() => handleDelete(source.id)}
                          disabled={deletingId === source.id}
                        >
                          {deletingId === source.id ? (
                            <span className={s.spinner}></span>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* List Source Dropdown 
          <div className={s.dropdown}>
            <button onClick={() => setShowList(!showList)} className={s.dropdown_btn}>
              {showList ? "⬆ Hide List Sources" : "⬇ List Sources"}
            </button>
            {showList && (
              <div className={s.source_list}>
                {sources.length === 0 ? (
                  <p>No sources found.</p>
                ) : (
                  <ul>
                    {sources.map((source) => (
                      <li key={source.id} className={s.source_item}>
                        <strong>{source.name}</strong> — ID: {source.id}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>*/}
        </div>
      </div>
    </>
  );
};

export default SourceManagement;
