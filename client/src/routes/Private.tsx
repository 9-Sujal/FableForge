import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import useAuth from "../hooks/useAuth";


export default function Private() {

    const {status} = useAuth(); 
    const notLoggedIn = status === "unauthenticated"; 
    const busy = status==="busy"; 

    if(busy) return <LoadingSpinner/>

  return notLoggedIn ? <Navigate to="/sign-up"/> : <Outlet/>
  
}
