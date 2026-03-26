import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";


export default function Author() { 

    const {profile} = useAuth(); 

    const isAuthor = profile?.role === "author"; 

  return isAuthor ? <Outlet/> : <Navigate to="/not-found" />;
}; 
