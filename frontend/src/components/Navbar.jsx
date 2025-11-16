
import { Link,useNavigate } from "react-router-dom";
import s from "../styles/NavBar.module.css";
import { useAuth } from "./context/AuthContext";

export default function NavBar(){
    const {user, logout} = useAuth()
    const navigate = useNavigate();

    const handleLogout = ()=>{
        logout();
        console.log("Logged out");
        navigate("/login")
        return;
    }

    const handleLogin=()=>{
        navigate("/login");
    }


    return(
        <>
            {/* Simple NavBar */}
            <nav className={s.navBarCont} >
                <div className={s.links}>
                    <Link to="/logs" className={s.logs} >Logs</Link>
                    <Link to="/dashboard" className={s.dashboard} >Dashboard</Link>
                    <Link to="/accesstoken" className={s.access} >API Key</Link>
                    <Link to="/source-management" className={s.register}>Source Management </Link>
                    <Link to="/log-management" style={{color:"#66fcf1"}}>Logs Management</Link>
                </div>
                {user ? <button className={s.logoutBtn} onClick={handleLogout} >Logout</button> : 
                <button className={s.login} onClick={handleLogin}>Login</button> }
            </nav>
        </>
    )
}
