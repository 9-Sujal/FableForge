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
    <Navbar>
      <NavbarBrand>
        <RouterLink to="/" className="flex items-center justify-center space-x-2">
          <FaBookReader size={24} />
          <p className="font-bold text-inherit">Store</p>
        </RouterLink>
      </NavbarBrand>

      <NavbarContent className="" justify="end">
        <NavbarItem>
          <DarkModeSwitch/>
        </NavbarItem>
         <NavbarItem className="md:flex hidden">
            <RouterLink to="/cart">
              <Badge  color="danger" shape="circle">
                <FaCartShopping size={24} />
              </Badge>
            </RouterLink>
          </NavbarItem>
          
          <NavbarItem className="md:flex">
           <ProfileOptions />
        </NavbarItem>
        <NavbarItem 
        className="flex cursor pointer md:hidden"
        onClick={openNav}>
         <IoMenu size={26} />
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
          isLoggedIn= {true}
        />
      </div>
    </>
  );
}


