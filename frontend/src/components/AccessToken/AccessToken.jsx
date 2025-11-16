import { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import NavBar from "../Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import s from "../../styles/apiKey.module.css";

export default function AccessToken(){
    const navigate = useNavigate();
    const {user} = useAuth()
    const {token} = useAuth()
    const loginToken = localStorage.getItem("token");
    const [feedback,setFeedback] = useState("");
    const [loading,setLoading] = useState(false);

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
        setLoading(true);

        try{
            const res = await axios.post("http://127.0.0.1:8000/sdk/regenerate-api-key",
                {
                    token: loginToken
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
                toast.error("Bad request")
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
                    
                    <button className={s.submit_btn} onClick={handleGenerate}>
                        {loading? <span className={s.spinner}></span> : "Generate API Key" }
                    </button>
                    {feedback && (
                        <div style={{ marginTop: "10px" }}>
                            <p>{feedback}</p>
                            <button className={s.copy_btn} onClick={handleCopy}>Copy</button>
                        </div>
                    )}

                    <p className={s.Note} >Note:The API key will be shown only once.  </p>
                </div>
            </div>
        </>
    )
}