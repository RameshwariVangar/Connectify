import axios from "axios";

//export const BASE_URL = "https://connectify-yw2s.onrender.com" ;

export const BASE_URL = "https://connectify-yw2s.onrender.com";

export const clientServer = axios.create({
    baseURL: BASE_URL 
});