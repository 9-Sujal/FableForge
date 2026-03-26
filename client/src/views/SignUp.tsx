import { useState} from "react";
import type { SyntheticEvent } from "react";
import client from "../api/client";

import { RiMailCheckLine } from "react-icons/ri";
import Book from "../svg/Book";
import { Button, Input } from "@heroui/react";

const emailRegex = new RegExp(
  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
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

  
  if(showSuccessResponse)return (
    <div className="flex-1 flex flex-col items-center justify-center md:p-0 p-4" >
      <RiMailCheckLine size={80} className="animate-bounce"/>
      <p className="text-lg text-center"> Please check your email we just send you a link</p>
      <p className="font-semibold">
       If you are a new user then it may take some time to show up main inside your inbox, so have patience. 
      </p>


    </div>

  )
  return(
    <div className="flex-1 flex items-center justify-center ">
       <div className="flex flex-col items-center justify-center w-96 border-2 border-slate-400 dark:border-slate-50  p-5 rounded-xl">
        <Book className="w-44 h-44" />
        <h1 className="text-center text-xl font-semibold">
          Books are the keys to countless doors. Sign up and unlock your potential. 
        </h1>
        <form onSubmit={handleSubmit} className="w-full space-y-4 mt-6">
          <Input
          
           placeholder="xyz@email.com"
           variant="bordered"
           isInvalid={invalidForm}
            value={email}
            onChange={(e) => setEmail(e.target.value)}  
            errorMessage={invalidForm? "Please enter a valid email address" : undefined}
            className="border-2 border-slate-500 rounded-xl "
          />
          <Button isLoading={busy} type="submit" className="w-full bg-slate-400 rounded-xl text-slate-100 ">Send me the link</Button>
        </form>
       </div>

    </div>

  )
}

