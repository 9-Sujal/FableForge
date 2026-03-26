import { Badge, Button } from "@heroui/react";
import clsx from "clsx";
import { FaBookReader } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link as RouterLink } from "react-router-dom";
import DarkModeSwitch from "./common/DarkModeSwitch";

type MobileNavProps = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  cartTotal?: number | string;
  isAuthor?: boolean;
  isLoggedIn: boolean;
};

export default function MobileNav({visible, onClose, onLogout, cartTotal, isAuthor = false, isLoggedIn, }: MobileNavProps) {
  return (
   <div className="">
     <div className={clsx(
        visible ? "left-0": "-left-full", "fixed top-0 bottom-0 z-100 w-3/4 bg-white dark:bg-black transition-all"
     )}>
        <div className="pt-10 px-5 space-y-3">
            <div className="flex items-center justify-between">
                <RouterLink 
                to="/"
                onClick={onClose}
                className="flex items-center space-x-2">
                    <FaBookReader size={24} />
                    <p className="font-bold">Store</p>
                    
                </RouterLink>
                

                <div className="flex iterms-center space-x-2">
                    <div className="px-4 py-2">
                        <RouterLink to="/cart" onClick={onClose}>
                            <Badge content={cartTotal} color="danger" shape="circle">
                                <FaCartShopping size={24} />
                            </Badge>
                        </RouterLink>
                    </div>

                    <div className="px-4 py-2">
                      <DarkModeSwitch/>
                    </div>
                </div>
            </div>
            <hr/>
           { isLoggedIn&&(
            <ul className="space-y-2 p-4">
              <li>
                <RouterLink to="/profile" onClick={onClose}>
                  Profile
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/orders" onClick={onClose}>
                  Orders
                </RouterLink>
              </li>
             
                <li>
                  <RouterLink to="/library" onClick={onClose}>
                    Library
                  </RouterLink>
                </li>
                
                {isAuthor && (
                    <li>
                        <RouterLink to="/create-new-book" onClick={onClose}>
                            Create New Book
                        </RouterLink>
                    </li>
                )}
        

            </ul>
           )}
                   {isLoggedIn && (
              <div>

                <button onClick={() => {
                  onLogout();
                  
                }}>
                  Logout
                </button>
              </div>
                )}
                {!isLoggedIn && (
              <div>
                <Button  as={RouterLink}
              to="/sign-up"
              onPress={onClose}
              variant="bordered"
              className="w-full">
              
                  Sign Up/in
              
                </Button>
              </div>
                )}
        </div>
     </div>
     {/* backdrop */}
     <div 
    onClick={onClose}
     className={clsx(visible? "fixed" : "hidden",
        "inset-0 z-50 dark:bg-white dark:bg-opacity-50 bg-black bg-opacity-50 backdrop-blur"
     )}></div>
   </div>
  )
}

