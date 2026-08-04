import Head from "next/head";
import Image from "next/image";
import  styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";



const inter = Inter({subsets : ["latin"]});

export default function App() {

   const router = useRouter();
  return (
    <div className="container">
        <div className="mainContainer" >
            <div className="mainContainer__left">
                <p>Connect with Friends without Exaggeration</p>

                <p>A true social media platform , with stories no blufs !</p>
                 <div  onClick = {
                ()=>{
                  router.push("/login");
                }
               } className="buttonJoin">
                 <p>join now</p>
               </div>
            </div>
            <div className="mainContainer__right">
               <img src="images/connectify.jpg" alt="img"/>

              
            </div>
        </div>
    </div>
  );
}