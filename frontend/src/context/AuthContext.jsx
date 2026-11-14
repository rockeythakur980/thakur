import {createContext, useContext, useState} from "react";
import API from "../api";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(()=> {
        try{
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch{
            return null;
        }
    });

    const register = async (name, email, password) =>{
        const {data} = await API.post("/auth/register", {
            name,
            email,
            password
        });

        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);

        return data;
    };

    const login = async (email, password) =>{
        const {data} = await API.post("/auth/login", {
            email,
            password
        });

        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () =>{
        localStorage.removeItem("user");
        setUser(null);
    };

    return(
        <AuthContext.Provider
            value = {{
                user,
                register,
                login,
                logout
            }}
            > { children } </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);