import { useNavigate,Link,Navigate } from "react-router-dom"
import { useEffect } from "react";

export default function Home(){
    const navigate = useNavigate()
    useEffect(()=>{
        setTimeout(() => {
            navigate("login")
        }, 0);
    },[navigate])
    

    return(
        <div>
            <h2>Redirecting...</h2>
        </div>
    )
};