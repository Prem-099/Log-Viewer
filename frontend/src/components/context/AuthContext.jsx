import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => localStorage.getItem("user") || null);

    const login = (token, username) => {
        setToken(token);
        setUser(username);
        console.log(token)
        localStorage.setItem("token", token)
        localStorage.setItem("user", username)
        setTimeout(() => {
            navigate("/logs")
        }, 1000);
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    };

    useEffect(() => {
        if (!token && !["/login", "/signup"].includes(window.location.pathname)) {
            toast.error("Login required");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    }, [token, navigate]);

    /*useEffect(() => {
        const handleUnload = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, []);*/

    return(
        <AuthContext.Provider value={{token, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);