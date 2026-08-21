import React, { useCallback, memo } from "react";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer/index.js";
import { selectProfileFetched, selectLoggedUserName } from "@/config/redux/selectors/authSelectors";

function NavbarComponent() {
    const router = useRouter();
    const dispatch = useDispatch();

    const profileFetched = useSelector(selectProfileFetched);
    const userName = useSelector(selectLoggedUserName);

    const handleLogout = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem("token");
        }
        router.push("/login");
        dispatch(reset());
    }, [router, dispatch]);

    const handleNavigateProfile = useCallback(() => {
        router.push("/profile");
    }, [router]);

    const handleNavigateHome = useCallback(() => {
        router.push("/");
    }, [router]);

    const handleNavigateLogin = useCallback(() => {
        router.push("/login");
    }, [router]);

    return (
        <div className={styles.container}>
            <nav className={styles.navBar}>
               <h1 style={{ cursor: "pointer" }} onClick={handleNavigateHome}>
                  Pro Connect
               </h1>
               <div className={styles.navbarOptionContainer}>
                  {profileFetched ? (
                     <div style={{ display: "flex", gap: "1.2rem", marginRight: "2rem", fontSize: "2rem" }}>
                        <p>{userName}</p>
                        <p onClick={handleNavigateProfile} style={{ fontWeight: "bold", cursor: "pointer" }}>Profile</p>
                        <p onClick={handleLogout} style={{ fontWeight: "bold", cursor: "pointer" }}>LogOut</p>
                     </div>
                  ) : (
                     <div onClick={handleNavigateLogin} className={styles.buttonJoin}>
                        <p>Be a Part</p>
                     </div>
                  )}
               </div>
            </nav>
        </div>
    );
}

export default memo(NavbarComponent);