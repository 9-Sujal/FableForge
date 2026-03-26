import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "./auth-context";
import { getAuthState, updateAuthStatus, updateProfile } from "../store/auth";
import client from "../api/client";
import { useEffect } from "react";



interface AuthProviderProps {
    children: React.ReactNode;
}
export default function AuthProvider({ children }: AuthProviderProps) {
  const { profile, status } = useSelector(getAuthState);
  const dispatch = useDispatch();

  const signOut = async () => {
    try {
      dispatch(updateAuthStatus("busy"));
      await client.post("/auth/logout");
      dispatch(updateAuthStatus("unauthenticated"));
      dispatch(updateProfile(null));
    } catch (error) {
      console.error(error);
      dispatch(updateAuthStatus("unauthenticated"));
    }
  };

  // change null to data. 
    useEffect(()=>{
        client
           .get("/auth/profile")
           .then(()=>{   
            dispatch(updateAuthStatus("authenticated")); 
            dispatch(updateProfile(null));
           })
           .catch(()=>{
            dispatch(updateAuthStatus("unauthenticated")); 
           })
    },[dispatch])
   return(
    <AuthContext.Provider value={{ profile, status, signOut}}>
        {children}
        </AuthContext.Provider>
   )
   
}

