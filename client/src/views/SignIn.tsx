import { useState, type SyntheticEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { Button, Input } from "@heroui/react";
import client from "../api/client";
import { updateAuthStatus, updateProfile } from "../store/auth";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      // Step 1: Login
      await client.post("/auth/login", { email, password });

      // Step 2: Get profile
      const res = await client.get("/auth/profile");
      console.log("profile response:", res.data); 

      // Step 3: Update Redux
      dispatch(updateProfile(res.data.profile));
      dispatch(updateAuthStatus("authenticated"));

      // Step 4: Redirect
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Login failed");
      dispatch(updateAuthStatus("unauthenticated"));
    } finally {
      setBusy(false);
    }
  };

  return (
 <div className="relative flex-1 flex items-center justify-center min-h-screen overflow-hidden
                     bg-[#f8fafc] dark:bg-[#030303] px-4 transition-colors duration-500">
 
      {/* ambient glow accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] h-96 w-96 rounded-full
                        bg-blue-500/10 blur-[120px] dark:bg-cyan-500/20" />
        <div className="absolute -bottom-[10%] -left-[10%] h-96 w-96 rounded-full
                        bg-purple-500/10 blur-[120px] dark:bg-indigo-500/20" />
      </div>
 
      <div className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden
                       border border-black/5 dark:border-white/10
                       bg-white/70 dark:bg-white/5
                       backdrop-blur-xl shadow-2xl p-7">
 
        <h1 className="text-2xl font-bold tracking-tight text-center mb-1
                       text-slate-900 dark:text-transparent dark:bg-clip-text
                       dark:bg-linear-to-br dark:from-white dark:to-slate-400">
          Welcome back
        </h1>
        <p className="text-center text-sm text-slate-500 dark:text-cyan-100/50 mb-6">
          Sign in to continue your reading
        </p>
 
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            variant="bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            classNames={{
              inputWrapper:
                " m-2 border-black/10 dark:border-white/10 data-[hover=true]:border-cyan-500/50 group-data-[focus=true]:!border-cyan-500",
            label:"pb-4", }}
          />
 
          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            classNames={{
              inputWrapper:
                "m-2 border-black/10 dark:border-white/10 data-[hover=true]:border-cyan-500/50 group-data-[focus=true]:!border-cyan-500",
            label:"pb-4"}}
          />
 
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
 
          <Button
            type="submit"
            isLoading={busy}
            radius="lg"
            className="w-full font-medium
                       bg-slate-900 text-white
                       dark:bg-linear-to-r dark:from-cyan-500 dark:to-indigo-500 dark:text-white
                       hover:opacity-90 transition-opacity"
          >
            Sign in
          </Button>
        </form>
 
        <p className="text-sm text-center mt-5 text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}