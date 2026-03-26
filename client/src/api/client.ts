

import axios from "axios";

let baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8989";
if(import.meta.env.MODE === "development"){
    baseURL = "http://localhost:8989";}

     const client = axios.create({
        baseURL, 
     }); 

     client.interceptors.request.use(function (config) {
        config.withCredentials= true; 

        return config; 
     }); 

     export default client; 