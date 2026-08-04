import React from "react";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {reset} from "@/config/redux/reducer/authReducer/index.js";

function NavbarComponent(){

    const router = useRouter();
    const dispatch = useDispatch();

    const authState = useSelector((state)=> state.auth);
    return(
        <div className={styles.container}>
            <nav className={styles.navBar}>
               
               <h1  style={{cursor:"pointer" }} onClick={()=>{
                  router.push("/");
               }}>Pro Connect</h1>
               <div className={styles.navbarOptionContainer}>
            

            {authState.profileFetched && <div>
                 <div style={{display:"flex" , gap:"1.2rem" , marginRight:"2rem",fontSize:"2rem"}}>
                   <p>{authState.user.userId.name}</p>
                   <p  onClick={()=>{
                         router.push("/profile");
                   }} style={{fontWeight: "bold", cursor:"pointer"}}>Profile</p>
                     <p onClick={()=>{
                         localStorage.removeItem("token");
                         router.push("/login");
                         dispatch(reset());
                     }}style={{fontWeight: "bold", cursor:"pointer"}}>LogOut</p>
                  </div>
            </div>}
             {!authState.profileFetched && 
                   <div onClick={ ()=>{
                     router.push("/login");
                   }} className={styles.buttonJoin}>
                   <p>Be a Part</p>
                </div>
                 }
               </div>
            </nav>
        </div>
    )
}

export default NavbarComponent;