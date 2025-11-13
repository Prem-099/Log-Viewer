import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { useAuth } from "../components/context/AuthContext"
import s from "../styles/signup.module.css";

export default function SignUpPage (){
    const {token} = useAuth();
    const [username,setUsername] = useState("");
    const [pwd, setPwd] = useState("");
    const [email,setEmail] = useState("");
    const [feedback,setFeedback] = useState("");
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate(); 

    useEffect(()=>{
        if(localStorage.getItem("token")){
            setFeedback("Session already exist! Redirecting...")
            setTimeout(()=>{navigate("/logs")},1500)
        }
    },[])


    const handleSignUp = async(e)=>{
        e.preventDefault()
        if(!username||!pwd||!email){
            setFeedback("All fields are required!")
            return;
        }
        setLoading(true);

        try{
            const res = await axios.post("http://127.0.0.1:8000/auth/user/register",
              {
                username: username,
                email:email,
                password: pwd,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
              
            );

            setFeedback("Successfully Registered.Redirecting...");
            setTimeout(() => {
              navigate("/login")
            }, 1000);
        }catch(err){
            if(err.response){
                setFeedback(" Error: " + err.response.data.detail || err.response.data);
            } else {
                setFeedback("Network Error: "+err.message);
            } 
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className={s.body}>
            <div className={s.container}>
                <h3>SignUp</h3>
                <form className={s.form} onSubmit={handleSignUp}>
                    <label htmlFor="username">Username</label><br />
                    <input 
                        type="text" 
                        id="username" 
                        placeholder="Username"
                        value={username}
                        onChange={(e)=>{setUsername(e.target.value)}} 
                        required
                    /><br />
                    <label htmlFor="email">Email</label> <br />
                    <input 
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value)}}
                        required
                    /> <br />
                    <label htmlFor="pwd">Password</label><br />
                    <input 
                        type="password" 
                        id="pwd" 
                        placeholder="password"
                        value={pwd}
                        onChange={(e)=>{setPwd(e.target.value)}}
                        required 
                    /><br />
                    {feedback && <p style={{color: feedback.includes("Successfully")?"green":"red"}}>{feedback}</p> }
                    <button className={s.submit_btn} type="submit">
                       {loading ? <span className={s.spinner}></span> : "Submit"}
                    </button>
                </form>
                <p className={s.redirect}>Already have an account? <Link to="/login">Login</Link> </p>
            </div>
        </div>
    )
};
