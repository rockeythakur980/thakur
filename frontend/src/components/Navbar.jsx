import { LogOut, CheckSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const {user, logout} = useAuth();

    return(
        <nav className="navbar">
            <div className="brand">
                <CheckSquare size={25}/>
                <span>TaskFlow</span>
            </div>
            <div className="nav-right">
                <span>Hi, {user?.name}
                </span>
                <button className="logout-btn" onClick={logout}>
                    <LogOut size={17}/> LogOut
                </button>
            </div>
        </nav>
    );
}


export default Navbar;