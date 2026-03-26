import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User, DropdownSection } from "@heroui/react";
import type { Profile } from "../../store/auth";
import { Link } from "react-router-dom";


interface ProfileProps{
    profile: Profile; 
    signOut : () => void; 
}

export default function ProfileMenu({profile, signOut}:ProfileProps) {
    const {email, role,  avatar} = profile; //add name
  return (
   <div className="flex items-center gap-4">
        <Dropdown placement="bottom-start"> 
            <DropdownTrigger>
                <User
                as="button"
                name="User"  //name={profile?.name || "User"}
                avatarProps={{
                    isBordered: true,
                    src:avatar,
                }}/>

            </DropdownTrigger>
            <DropdownMenu aria-label="User-Actions" variant="flat" >
                <DropdownSection showDivider>
                    <DropdownItem 
                    textValue="just to remove warning" key="profile" 
                    className="h-14 gap-2">
                        <div >
                            <p className="font-bold">Signed in as</p>
                            <p className="font-bold">{email}</p>
                        </div>
                    </DropdownItem>
                    <DropdownItem key="my_library" textValue="library" className="p-0">
                        <Link to="/library" title="My Library" className="px-2 py-1.5 w-full block" > My Library</Link>

                    </DropdownItem>
                     <DropdownItem key="orders" textValue="orders" className="p-0">
                        <Link to="/orders" title="My Orders" className="px-2 py-1.5 w-full block" > My Orders</Link>

                    </DropdownItem>
                     </DropdownSection>
                    {role === "author"?(
                        <DropdownSection showDivider>
                            <DropdownItem key="analytics">  Analytics</DropdownItem>
                            <DropdownItem key="create_new_book" textValue="Create New Book" className="p-0">
                                   <Link to="/create-new-book" title="Create New Book" className="px-2 py-1.5 w-full block">Create New Book</Link>

                            </DropdownItem>
                            </DropdownSection>
                    ):(
                   <DropdownItem key="empty" textValue="empty item" className="p-0"></DropdownItem>
                    )}
  <DropdownItem className="p-0" textValue="Profile item" key="profile">
            <Link className="px-2 py-1.5 w-full block" title="Profile" to="/profile" > Profile</Link>
          </DropdownItem>
           <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                    

    <DropdownItem onClick={signOut} key="logout" color="danger">
            Log Out
          </DropdownItem>
               
            
              
            </DropdownMenu>
        </Dropdown>
   </div>
  )
}
