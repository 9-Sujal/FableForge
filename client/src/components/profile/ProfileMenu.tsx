import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User, DropdownSection } from "@heroui/react";
import type { Profile } from "../../store/auth";
import { Link } from "react-router-dom";
import type { FC } from "react";


interface ProfileProps{
    profile: Profile; 
    signOut : () => void; 
}

interface LinkProps {
  title: string;
  to: string;
}

const DropdownLink: FC<LinkProps> = ({ title, to }) => (
  <Link className="px-2 py-1.5 w-full block" to={to}>
    {title}
  </Link>
);
export default function ProfileMenu({profile, signOut}:ProfileProps) {
    const {email, role, name, avatar} = profile; //add name
    return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: avatar,
            }}
            className="transition-transform"
            name={name}
          />
        </DropdownTrigger>
        <DropdownMenu 
  aria-label="User Actions"
  variant="flat"
  className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl shadow-xl shadow-black/10 p-1">
          <DropdownSection showDivider>
            <DropdownItem
              textValue="just to remove warning"
              key="profile"
             className="p-0 rounded-lg data-[hover=true]:bg-black/5 dark:data-[hover=true]:bg-white/10"
>
              <div>
                <p className="font-bold">Signed in as</p>
                <p className="font-bold">{email}</p>
              </div>
            </DropdownItem>
            <DropdownItem key="my_library" textValue="library"  className="p-0 rounded-lg data-[hover=true]:bg-black/5 dark:data-[hover=true]:bg-white/10"
>
              <DropdownLink title="My Library" to="/library" />
            </DropdownItem>
            <DropdownItem textValue="orders" key="orders"  className="p-0 rounded-lg data-[hover=true]:bg-black/5 dark:data-[hover=true]:bg-white/10"
>
              <DropdownLink title="My Orders" to="/orders" />
            </DropdownItem>
          </DropdownSection>

          {role === "author" ? (
            <DropdownSection showDivider>
              <DropdownItem key="analytics"  className="p-0 rounded-lg data-[hover=true]:bg-black/5 dark:data-[hover=true]:bg-white/10"
>Analytics</DropdownItem>
              <DropdownItem
                textValue="Create New Book"
                key="create_new_book"
               className="p-0 rounded-lg data-[hover=true]:bg-black/5 dark:data-[hover=true]:bg-white/10"
>
                <DropdownLink title="Create New Book" to="/create-new-book" />
              </DropdownItem>
            </DropdownSection>
          ) : (
            <DropdownItem textValue="empty item" key="empty" className="p-0 rounded-lg data-[hover=true]:bg-black/5 dark:data-[hover=true]:bg-white/10"> </DropdownItem>
          )}

          <DropdownItem  className="p-0 rounded-lg data-[hover=true]:bg-black/5 dark:data-[hover=true]:bg-white/10"
textValue="Profile item" key="profile">
            <DropdownLink title="Profile" to="/profile" />
          </DropdownItem>
          <DropdownItem key="help_and_feedback" className="p-0 rounded-lg data-[hover=true]:bg-black/5 dark:data-[hover=true]:bg-white/10"
>Help & Feedback</DropdownItem>
          <DropdownItem onClick={signOut} key="logout" color="danger"  className="p-0 rounded-lg data-[hover=true]:bg-black/5 dark:data-[hover=true]:bg-white/10"
>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};


