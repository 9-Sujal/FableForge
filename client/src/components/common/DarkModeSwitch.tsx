import { Switch } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { IoMoon, IoSunnyOutline } from "react-icons/io5";






export default function DarkModeSwitch() {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    const updateLocalStorage = (themeMode?: "dark") =>{
        if(themeMode) localStorage.setItem("theme", themeMode); 
        else localStorage.removeItem("theme");
    }
    // we use useCallback to memoize the enableDarkMode and disabledDarkMode functions,
    // so that they are not recreated on every render, which can improve the performance of the component.
     const enableDarkMode = useCallback(() => {
        document.documentElement.classList.add("dark"); 
        updateLocalStorage("dark"); 
        setDarkMode(true);
     }, []);

     const disabledDarkMode = ()=>{
        document.documentElement.classList.remove("dark"); 
        updateLocalStorage(); 
        setDarkMode(false);
     }; 
//we use useEffect to add or remove the dark class to the html element when the darkMode state changes.
// it helps to apply the dark mode styles defined in tailwindcss when the darkMode state is true and remove the dark mode styles when the darkMode state is false.
// performance optimization: by using useEffect we can avoid unnecessary re-renders of the component when the darkMode state changes, 
// because we are only adding or removing the dark class to the html element and not re-rendering the entire component.
     useEffect(()=>{
        if(darkMode){
            document.documentElement.classList.add("dark"); 
          } else {
            document.documentElement.classList.remove("dark");
          }

     }, [darkMode]);



  return (
     <Switch
     size="sm"
     color="success"
    startContent = {<IoSunnyOutline/>}
    endContent = {<IoMoon/>}
    onChange={(e)=>{
        const {checked} = e.target; 
        if(checked) enableDarkMode(); 
        else disabledDarkMode(); 
        setDarkMode(checked); 
    }}
     />
  )
}

















