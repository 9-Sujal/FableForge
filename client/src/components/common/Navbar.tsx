import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Badge,
//   DropdownItem,
//   DropdownTrigger,
//   Dropdown,
//   DropdownMenu,
//   Avatar,
} from "@heroui/react";

import { FaBookReader } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link as RouterLink } from "react-router-dom";
import DarkModeSwitch from "./DarkModeSwitch";
import ProfileOptions from "../profile/ProfileOptions";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import MobileNav from "../MobileNav";
import useAuth from "../../hooks/useAuth";
import SearchForm from "../SearchForm";



export default function HeadNavbar() {
    
    const [showNav, setShowNav] = useState(false);
    const { signOut} = useAuth(); 
  const isAuthor = true;
  const totalCount = 0;
  // const profile = null;

  const closeNav = () => setShowNav(false);
  const openNav = () => setShowNav(true);

 
    // const {totalCount} = useCart();


    return (
       <>
      <Navbar
        className="bg-white/70 dark:bg-[#030303]/70 backdrop-blur-xl
                   border-b border-black/6 dark:border-white/6
                   shadow-none"
        maxWidth="full"
      >
        <NavbarBrand className="md:flex hidden">
          <RouterLink to="/" className="flex items-center justify-center space-x-2">
            <FaBookReader size={22} className="text-cyan-600 dark:text-cyan-400" />
            <p className="font-bold text-inherit tracking-tight">Store</p>
          </RouterLink>
        </NavbarBrand>
 
        <NavbarContent className="w-full" justify="center">
          <SearchForm />
        </NavbarContent>
 
        <NavbarContent justify="end">
          <NavbarItem className="md:flex hidden">
            <DarkModeSwitch />
          </NavbarItem>
 
          <NavbarItem className="md:flex hidden">
            <RouterLink
              to="/cart"
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <Badge content={totalCount || undefined} color="danger" shape="circle">
                <FaCartShopping size={22} className="text-slate-700 dark:text-slate-200" />
              </Badge>
            </RouterLink>
          </NavbarItem>
 
          <NavbarItem className="md:flex">
            <ProfileOptions />
          </NavbarItem>
 
          <NavbarItem
            className="flex cursor-pointer md:hidden p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            onClick={openNav}
          >
            <IoMenu size={24} className="text-slate-700 dark:text-slate-200" />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
 
      <div className="block md:hidden">
        <MobileNav
          isAuthor={isAuthor}
          visible={showNav}
          onClose={closeNav}
          cartTotal={totalCount}
          onLogout={signOut}
          isLoggedIn={true}
        />
      </div>
    </>  );
}


