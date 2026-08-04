import NavbarComponent from '@/Components/Navbar'
import { getAboutUser, getAllChats } from '@/config/redux/action/authAction';
import DashBoardLayOut from '@/layout/DashBoardLayOut'
import UserLayout from '@/layout/userLayout'
import { BASE_URL } from '@/config';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.css';
import { useRouter } from 'next/router';


export default function GetAllChats() {

    const dispatch = useDispatch();
    const authstate = useSelector((state) => state.auth);
    const router = useRouter();

    const loggedUserId = authstate?.user?.userId?._id || authstate?.user?._id;

    // 1. Token se user profile refresh karne ke liye
    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }, [dispatch]);

    // 🚨 2. STRICT CHATS FETCH LOCK:
    useEffect(() => {
        // 🌟 Check lagaya: ID honi chahiye, aur uski length 24 character honi chahiye (MongoDB Standard)
        if (loggedUserId && loggedUserId !== "undefined" && loggedUserId.length === 24) {
            console.log("🚀 Sending clean and valid ID to backend action:", loggedUserId);
            dispatch(getAllChats (loggedUserId));
        } else {
            console.log("⏳ Waiting for valid loggedUserId... Current value:", loggedUserId);
        }
    }, [loggedUserId, dispatch]);

   const allUserChats = authstate?.getMyChat || [];

    
    const activeChatsOnly = allUserChats.filter((chat) => {
    return chat?.messages && chat?.messages.length > 0;
});

    return (
        <UserLayout>
            <DashBoardLayOut>
                <div>
                   {activeChatsOnly?.length === 0 ? (
                        <p className={styles.emptyMessage}>No active conversations found.</p>
                    ) : (
                        activeChatsOnly.map((chat, index) => {
                            const chatPartner = chat?.participants?.find(
                                (p) => String(p?._id) !== String(loggedUserId)
                            );

                            return (
                                <div 
                                    key={index} 
                                    onClick={() => router.push(`/chats/?receiverId=${chatPartner?._id}`)}
                                    className={styles.chatCard}
                                >
                                    <img 
                                        src={chatPartner?.profilePicture ? `${BASE_URL}/${chatPartner.profilePicture}` : "/default-avatar.png"} 
                                        alt='profile'
                                        className={styles.avatar}
                                    />
                                    <div className={styles.info}>
                                        <h4 className={styles.name}>{chatPartner?.name || "Unknown User"}</h4>
                                        <p className={styles.username}>@{chatPartner?.username}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                
                </div>
            </DashBoardLayOut>
        </UserLayout>
    )
}
