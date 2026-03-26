import { useState, type ChangeEventHandler} from "react";
import { parseError } from "../../utils/helper";
import { Avatar, Button, Input } from "@heroui/react";


interface UserProps{
    title: string;
    btnTitle: string; 
    name?: string; 
    avatar?: string; 
    onSubmit(data: FormData): Promise<void>; 
}
type UserInfo = {name: string; avatar?: File}; 


export default function NewUserForm({title, btnTitle, name, avatar, onSubmit}: UserProps) {
    const [userInfo, setUserInfo] = useState<UserInfo>({name:""});
    const [localAvatar, setLocalAvatar] = useState("");
    const [invalidForm, setInvalidForm] = useState(false); 
    const [busy, setBusy] = useState(false); 

    const handleChange: ChangeEventHandler<HTMLInputElement> = ({target}) =>{
        const {name, value, files} = target;
        if(name === "name"){
            setUserInfo({...userInfo, name: value}); 

        }
        if(name === "avatar" && files){
            const file = files[0]; 
            setUserInfo({...userInfo, avatar: file});
            setLocalAvatar(URL.createObjectURL(file)); 
        }
    }; 
    const handleSubmit = async (evt: React.SyntheticEvent<HTMLFormElement>) =>{
        evt.preventDefault(); 
        
        const formData = new FormData();
        if(userInfo.name.trim().length < 3){
            return setInvalidForm(true); 

        }else{
            setInvalidForm(false); 
        }
        formData.append("name", userInfo.name); 
        if(userInfo.avatar?.type.startsWith("image")){
            formData.append("avatar", userInfo.avatar); 
        }
        setBusy(true); 
        try{
            await onSubmit(formData); 

        }catch(error){
            parseError(error)
        }finally{
            setBusy(false); 
        }
    }

  return (
  <div className="flex-1 flex justify-center items-center">
      <div className="w-96 border-2 p-5 rounded-md flex flex-col justify-center items-center">
        <h1 className="text-center text-xl font-semibold">{title}</h1>
        <form onSubmit={handleSubmit} className="w-full space-y-6 mt-6">
          <label
            className="cursor-pointer flex justify-center items-center"
            htmlFor="avatar"
          >
            <Avatar
              src={localAvatar || avatar}
              isBordered
              radius="sm"
              name={userInfo.name}
            />
            <input
              accept="image/*"
              hidden
              type="file"
              name="avatar"
              id="avatar"
              onChange={handleChange}
            />
          </label>

          <Input
            type="text"
            name="name"
            label="Full Name"
            placeholder="John Doe"
            variant="bordered"
            value={userInfo.name || name}
            onChange={handleChange}
            isInvalid={invalidForm}
            errorMessage="Name must be 3 characters long!"
          />

          <Button isLoading={busy} type="submit" className="w-full">
            {btnTitle}
          </Button>
        </form>
      </div>
    </div>
  )
}
