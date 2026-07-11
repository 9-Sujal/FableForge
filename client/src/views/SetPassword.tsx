import { useState, type SyntheticEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Input } from "@heroui/react";
import client from "../api/client";

export default function SetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setBusy(true);
    setError("");

    try {
      await client.post("/auth/set-password", { email, token, password });
      // password set — now send them to login
      navigate("/sign-in");
    } catch (err) {
      setError("Something went wrong.");
      console.log(err)
    } finally {
      setBusy(false);
    }
  };

  if (!token || !email) return <p>Invalid link.</p>;

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-96 border-2 border-slate-400 p-5 rounded-xl">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Set your password
        </h1>
        <p className="text-sm text-center text-slate-500 mb-6">
          Choose a password to secure your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            isLoading={busy}
            className="w-full bg-slate-500 text-white"
          >
            Set password & sign in
          </Button>
        </form>
      </div>
    </div>
  );
}