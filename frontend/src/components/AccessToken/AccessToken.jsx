import axios from "axios";
import NavBar from "../Navbar";
import s from "../../styles/apiKey.module.css";
import { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useLogs } from "../context/LogContext";

export default function AccessToken(){
    const navigate = useNavigate();
    const {user, token} = useAuth()
    const { sources } = useLogs();
    const loginToken = localStorage.getItem("token");
    const [feedback,setFeedback] = useState("");
    const [loading,setLoading] = useState(false);
    const [source, setSource]  = useState("");

    useEffect(() => {
        const handleUnload = () => {
            setFeedback("");
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, []);


    const handleCopy = () => {
        if(feedback){
            navigator.clipboard.writeText(feedback);
            toast.success("Copied");
            return;
        }
    }


    const handleGenerate = async(e)=>{
        e.preventDefault();
        if(!token){
            toast.error("Token missing!");
            return;
        }

        if(!source) return;
        setLoading(true);

        try{
            const res = await axios.post("http://127.0.0.1:8000/sdk/regenerate-api-key",
                {
                    token: loginToken,
                    source_id: source
                },
                {
                    headers: {
                    "Content-Type": "application/json",
                    },
                }
            );
            setFeedback(res.data.api_key)

        }catch(err){
            if(err.response?.data.detail == "Exists"){
                setFeedback("Access token already exists.Retrieve!")
            }
            else{
                toast.error(err.response?.data.detail || "Bad request")
                //setFeedback("Bad request: ",err.data.detail)
            }
        }finally{
            setLoading(false);
        }

    }
    
    return(
        <>
            <NavBar/>
            <div className={s.body}>
                <div className={s.container}>
                    <h4>Don't have API Key? Generate now</h4>
                    <select className={s.dropdown}
                    value={source}
                    onChange={(e) => setSource(parseInt(e.target.value))}>
                        <option className={s.options} value="">Select source</option>
                        {sources.map((src)=>(
                                <option className={s.options} key={src.id} value={src.id}>
                                    {src.name}
                                </option>
                        ))}
                    </select>
                    <button className={s.submit_btn} onClick={handleGenerate}>
                        {loading? <span className={s.spinner}></span> : "Generate API Key" }
                    </button>
                    {feedback && (
                        <div style={{ marginTop: "10px" }}>
                            <p className={s.key}>{feedback}</p>
                            <button className={s.copy_btn} onClick={handleCopy}>Copy</button>
                        </div>
                    )}

                    <p className={s.Note} >Note:The API key will be shown only once.  </p>
                </div>
            </div>
        </>
    )
}