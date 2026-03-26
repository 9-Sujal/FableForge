import { createContext } from "react";
import type { AuthState } from "../store/auth";

export interface IAuthContext {
     profile: AuthState["profile"];
  status: AuthState["status"];
  signOut: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  profile: null,
  status: "unauthenticated",
  signOut() {},
});