import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import s from "../../styles/SourceRegister.module.css";
import NavBar from "../Navbar";
import toast from "react-hot-toast";
import axios from "axios";

const SourceRegister = () => {
    const {token} = useAuth();
    const [ sourcename, setSourcename] = useState("");
    const [responseData,setResponseData] = useState(null);
    const [loading,setLoading] = useState(false);

    const handleRegister = async(e)=>{
        e.preventDefault();
        
        if(!sourcename){
            toast.error("source name is required");
            return;
        }

        if(!token){
            toast.error("Login Required!");
            setLoading(false);
            return;
        }

        setLoading(true);

        try{
            const res = await axios.post("http://127.0.0.1:8000/sources/register",
                {
                    name:sourcename,
                    token:token,
                },
                {
                    headers: {
                    "Content-Type": "application/json",
                    },
                }
            );
            setResponseData(res.data);
            setSourcename("");
            toast.success("Registered");

        }catch(err){
            setLoading(false);
            if(err.response){
                toast.error(" Error: " + err.response.data.detail || err.response.data);
            } else {
                toast.error("Network Error: "+err.message);
            }
        }

    }

    return(
        <>  
            <NavBar/>
            <div>
                <h4>REGISTER SOURCE</h4>
                <div className={s.responsebox}>
                    {!responseData ? (
                        <form onSubmit={handleRegister}>
                            <label htmlFor="source">Source Name</label><br />
                            <input 
                                className={s.source_input}
                                type="text"
                                placeholder="Enter source name "
                                value={sourcename}
                                onChange={(e)=> {setSourcename(e.target.value)}}
                                required
                            /> <br />
                            <button 
                             className={s.submit_btn}
                             disabled={loading || !sourcename}
                             type="submit"
                            >
                                {loading? 
                                    <>Registering <span className={s.spinner}></span></>
                                        : "Register"
                                }
                            </button>
                        </form>
                    ):(
                        <div className={s.responseBox}>
                            <h3>✅ Source Registered Successfully!</h3>
                            
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
                            <p className={s.note}>Note: API Key will be shown only once.Store it securely</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )

}

export default SourceRegister;