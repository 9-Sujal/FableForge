import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import useAuth from "../hooks/useAuth";


export default function Guest() {
    const {status} = useAuth(); 
    const isLoggedIn = status === "authenticated"; 
    const busy = status === "busy";

    if(busy) return <LoadingSpinner/>

  return isLoggedIn ? <Navigate to="/profile"/> : <Outlet />;
   
}
