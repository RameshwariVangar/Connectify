'use client';

import React, { memo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './index.module.css';
import { getImageUrl, handleImageError } from '@/utils/imageUtils';

function ChatHeader() {
  
   const [savedReceiver, setSavedReceiver] = useState(null);

   const currentReceiver = useSelector((state) => {
      const activeChat = state.auth?.activeChat;
      const loggedInUsername = state.auth?.user?.userId?.username || state.auth?.user?.username;
      
      if (!activeChat?.participants || !loggedInUsername) return null;
      
      const found = activeChat.participants.find(
         (p) => p?.username !== loggedInUsername
      );

      if (!found) return null;

      return {
         _id: found._id,
         name: found.name,
         username: found.username,
         profilePicture: found.profilePicture
      };
   }, (prev, next) => {
      if (!prev && !next) return true;
      if (!prev || !next) return false;
      return (
         prev._id === next._id && 
         prev.profilePicture === next.profilePicture &&
         prev.name === next.name
      );
   });

   
   useEffect(() => {
      if (currentReceiver?._id) {
         setSavedReceiver(currentReceiver);
      }
   }, [currentReceiver?._id, currentReceiver?.profilePicture, currentReceiver?.name]);

   
   const displayReceiver = currentReceiver || savedReceiver;

   return (
      <div className={styles.receiver}>
         {displayReceiver ? (
            <>
               <img
                  src={getImageUrl(displayReceiver?.profilePicture)}
                  onError={handleImageError}
                  alt="profile"
                  className={styles.receiverAvatar}
               />
               <h3 className={styles.receiverName}>
                  {displayReceiver?.name} ({displayReceiver?.username})
               </h3>
            </>
         ) : (
            <div className={styles.headerLoader}>
               <div className={styles.spinnerMini}></div>
               <h3>Loading conversation details...</h3>
            </div>
         )}
      </div>
   );
}

export default memo(ChatHeader);