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
   const linkClass =
    "block py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors";
 
  return (
    <div>
      <div
        className={clsx(
          visible ? "left-0" : "-left-full",
          "fixed top-0 bottom-0 z-100 w-3/4 max-w-xs transition-all duration-300",
          "bg-white/90 dark:bg-[#030303]/95 backdrop-blur-xl",
          "border-r border-black/5 dark:border-white/10 shadow-2xl"
        )}
      >
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 blur-[100px]" />
        </div>
 
        <div className="relative pt-8 px-5 space-y-3">
          <div className="flex items-center justify-between">
            <RouterLink
              to="/"
              onClick={onClose}
              className="flex items-center space-x-2 text-slate-900 dark:text-white"
            >
              <FaBookReader size={22} className="text-cyan-600 dark:text-cyan-400" />
              <p className="font-bold">Store</p>
            </RouterLink>
 
            <div className="flex items-center space-x-1">
              <RouterLink
                to="/cart"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <Badge content={cartTotal} color="danger" shape="circle">
                  <FaCartShopping size={20} className="text-slate-700 dark:text-slate-200" />
                </Badge>
              </RouterLink>
 
              <div className="p-1">
                <DarkModeSwitch />
              </div>
            </div>
          </div>
 
          <div className="h-px w-full bg-linear-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
 
          {isLoggedIn && (
            <ul className="space-y-1 py-2">
              <li><RouterLink to="/profile" onClick={onClose} className={linkClass}>Profile</RouterLink></li>
              <li><RouterLink to="/orders" onClick={onClose} className={linkClass}>Orders</RouterLink></li>
              <li><RouterLink to="/library" onClick={onClose} className={linkClass}>Library</RouterLink></li>
              {isAuthor && (
                <li><RouterLink to="/create-new-book" onClick={onClose} className={linkClass}>Create New Book</RouterLink></li>
              )}
            </ul>
          )}
 
          {isLoggedIn && (
            <button
              onClick={onLogout}
              className="w-full text-left py-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          )}
 
          {!isLoggedIn && (
            <Button
              as={RouterLink}
              to="/sign-up"
              onPress={onClose}
              radius="lg"
              className="w-full font-medium
                         bg-slate-900 text-white
                         dark:bg-linear-to-r dark:from-cyan-500 dark:to-indigo-500"
            >
              Sign Up / In
            </Button>
          )}
        </div>
      </div>
 
      {/* backdrop */}
      <div
        onClick={onClose}
        className={clsx(
          visible ? "fixed" : "hidden",
          "inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        )}
      />
    </div>
  )
}

