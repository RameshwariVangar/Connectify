import Head from "next/head";
import Image from "next/image";
import  styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import UserLayout from "@/layout/userLayout";



const inter = Inter({subsets : ["latin"]});

export default function Home() {

   const router = useRouter();
  return (

    <UserLayout>
    <div className={styles.container}>
        <div className= { styles.mainContainer} >
            <div className={ styles.mainContainer__left}>
                <p>Connect with Friends without Exaggeration</p>

                <p>A true social media platform , with stories no blufs !</p>
                 <div  onClick = {
                ()=>{
                  router.push("/login");
                }
               } className={styles.buttonJoin}>
                 join now
               </div>
            </div>
            <div className={ styles.mainContainer__right }>
               <img src="images/connectify.jpg" alt="img"/>

              
            </div>
        </div>
    </div>
  </UserLayout>
  );
 
}