import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState }  from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function loginComponent(){

  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLoginMethod , setUserLoginMethod ] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [email    ,  setEmail  ] = useState("");
  const [password , setPassword] = useState("");
  const [username , setUsername] = useState("");
  const [name     ,    setName ] = useState("");
 
  useEffect(()=>{
    if(authState.loggedIn){
        
        router.push("/dashboard");
    }
  },[authState.loggedIn]);

  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/dashboard")
    }
    else{
      setPageLoading(false);
    }
  },[]);

  useEffect(()=>{
    dispatch(emptyMessage());
  },[userLoginMethod]);

  const HandleRegister = ()=>{
    console.log("register..");
    dispatch(registerUser({username,password,email,name}))
  }

 const handleLogin = ()=>{
  console.log("login...");
  dispatch(loginUser({email,password}));
 }


 if (pageLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#666' }}>
        <h3>Loading...</h3>
      </div>
    );
  }
 
return( 

    <UserLayout>
        <div  className={styles.container}>
          <div className={styles.cardContainer}>

            <div className={ styles.cardContainer__left}>
               
               <p className={ styles.cardLeft__heading }>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
               <br></br>
               <h2 style={{color : authState.isError ? "red":"orange"}}>{authState.message}</h2>
               <div className={styles.inputContainer}>
                  
                 { !userLoginMethod && <div className={styles.inputRow}>
                      <input  
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.inputField} 
                        type="text" placeholder="Username"/>
                      <input 
                         onChange={(e) => setName(e.target.value)}
                         className={styles.inputField} 
                         type="text" placeholder="Name"/>
                      
                  </div> }
                   <input 
                     onChange={(e)=> setEmail(e.target.value)}
                     className={styles.inputField}  
                     type="text" placeholder="Email"/>
                  <input 
                     onChange={(e)=> setPassword(e.target.value)}
                     className={styles.inputField}  
                     type="text" placeholder="Password"/>

                  <div  onClick={()=>{
                      
                        if(userLoginMethod){
                           handleLogin();
                        }
                        else{
                          HandleRegister();
                        }
                        
                     }}className={styles.buttonWithOutline}>
                    <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
                  </div>
               </div>
               
            </div>
             <div className={ styles.cardContainer__right}>
              
                  {userLoginMethod ? <p>Don't have an Account?</p>:<p>Already have an account</p>}
                  <div onClick={()=>{
                    setUserLoginMethod(!userLoginMethod);
                    
                  }} style={{color:"black", textAlign:"center"}} className={styles.buttonWithOutline}>
                    <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
                
                </div>
             </div>

          </div>
     </div>     
</UserLayout>
    )
   
}

export default loginComponent;