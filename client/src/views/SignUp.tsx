import { useState} from "react";
import type { SyntheticEvent } from "react";
import client from "../api/client";

import { RiMailCheckLine } from "react-icons/ri";
import Book from "../svg/Book";
import { Button, Input } from "@heroui/react";

const emailRegex = new RegExp(
  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
);


    const Background = ({ children }: { children: React.ReactNode }) => (
    <div className="relative flex-1 flex items-center justify-center min-h-screen overflow-hidden
                     bg-[#f8fafc] dark:bg-[#030303] px-4 transition-colors duration-500">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] h-96 w-96 rounded-full
                        bg-blue-500/10 blur-[120px] dark:bg-cyan-500/20" />
        <div className="absolute -bottom-[10%] -left-[10%] h-96 w-96 rounded-full
                        bg-purple-500/10 blur-[120px] dark:bg-indigo-500/20" />
      </div>
      {children}
    </div>
  ); 
export default function SignUp() {
  const [email, setEmail] = useState("");
  const [invalidForm, setInvalidForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const [showSuccessResponse, setShowSuccessResponse] = useState(false); 
  const handleSubmit= async(e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!emailRegex.test(email))return setInvalidForm(true); 

    setInvalidForm(false);

    setBusy(true); 
    try{
     const res= await client.post("/auth/generate-link", {email});
     console.log(res); 
        setShowSuccessResponse(true);
    } catch (error) {
      console.error("Error generating verification link:", error);
    } finally {
      setBusy(false); 
    }
  
  }
  //error cors policy fixed in 

 
  if (showSuccessResponse)
    return (
      <Background>
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-sm
                         rounded-2xl border border-black/5 dark:border-white/10
                         bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-2xl p-8">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-cyan-500/30 rounded-full" />
            <RiMailCheckLine size={64} className="relative text-cyan-500 animate-bounce" />
          </div>
          <p className="text-lg font-semibold mt-4 text-slate-900 dark:text-white">
            Check your inbox
          </p>
          <p className="text-sm mt-2 text-slate-500 dark:text-slate-400">
            We've sent a verification link to your email. New users — it may take a moment to arrive, so have patience.
          </p>
        </div>
      </Background>
    );
 
  return (
    <Background>
      <div className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden
                       border border-black/5 dark:border-white/10
                       bg-white/70 dark:bg-white/5
                       backdrop-blur-xl shadow-2xl p-7
                       flex flex-col items-center">
 
        <Book className="w-32 h-32 dark:drop-shadow-[0_0_20px_rgba(34,211,238,0.25)]" />
 
        <h1 className="text-center text-xl font-bold tracking-tight mt-2
                       text-slate-900 dark:text-transparent dark:bg-clip-text
                       dark:bg-linear-to-br dark:from-white dark:to-slate-400">
          Books are the keys to countless doors.
        </h1>
        <p className="text-center text-sm text-slate-500 dark:text-cyan-100/50 mt-1">
          Sign up and unlock your potential.
        </p>
 
        <form onSubmit={handleSubmit} className="w-full space-y-4 mt-6">
          <Input
            placeholder="xyz@email.com"
            variant="bordered"
            isInvalid={invalidForm}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorMessage={invalidForm ? "Please enter a valid email address" : undefined}
            classNames={{
              inputWrapper:
                "border-black/10 dark:border-white/10 data-[hover=true]:border-cyan-500/50 group-data-[focus=true]:!border-cyan-500",
            }}
          />
          <Button
            isLoading={busy}
            type="submit"
            radius="lg"
            className="w-full font-medium
                       bg-slate-900 text-white
                       dark:bg-linear-to-r dark:from-cyan-500 dark:to-indigo-500 dark:text-white
                       hover:opacity-90 transition-opacity"
          >
            Send me the link
          </Button>
        </form>
      </div>
    </Background>
  )
}

