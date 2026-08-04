import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

// steps for state managemnet
// submit action  
// Handle action in its reducer  
// register here -> reducer

export const store = configureStore({
     reducer :{
        auth : authReducer,
        postReducer : postReducer
     }
});