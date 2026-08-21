'use client';

import UserLayout from '@/layout/userLayout';
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser, accessChats, sendMsg, deleteMsg } from '@/config/redux/action/authAction';
import { selectLoggedUserId, selectActiveChat } from '@/config/redux/selectors/authSelectors';
import { useRouter } from 'next/router';
import styles from './index.module.css';

import ChatHeader from './ChatHeader';
import MessageItem from './MessageItem';
import ChatInput from './ChatInput';

export default function ChatPage() {
   const dispatch = useDispatch();
   const router = useRouter();

   const senderId = useSelector(selectLoggedUserId);
   const activeChatFromStore = useSelector(selectActiveChat);

   
   const cachedChatRef = useRef(null);
   if (activeChatFromStore) {
      cachedChatRef.current = activeChatFromStore;
   }
   const activeChat = activeChatFromStore || cachedChatRef.current;

   const { receiverId } = router.query;
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedMsgId, setSelectedMsgId] = useState(null);

   const messagesEndRef = useRef(null);

   useEffect(() => {
      if (typeof window !== 'undefined' && localStorage.getItem("token")) {
         dispatch(getAboutUser({ token: localStorage.getItem("token") }));
      }
   }, [dispatch]);

   const chatId = activeChat?._id;

   useEffect(() => {
      if (senderId && receiverId) {
         dispatch(accessChats({
            loggedUserId: senderId,
            receiverId: receiverId
         }));
      }
   }, [senderId, receiverId, dispatch]);

   const handleSendMessage = useCallback((text) => {
      if (!chatId || !senderId) return;

      
      dispatch(sendMsg({
         chatId: chatId,
         sendId: senderId,
         msg: text
      }));
   }, [chatId, senderId, dispatch]);

   const handleDeleteClick = useCallback((msgId) => {
      setSelectedMsgId(msgId);
      setIsModalOpen(true);
   }, []);

   const handleConfirmDelete = useCallback(async () => {
      setIsModalOpen(false); 
      if (selectedMsgId) {
         
         await dispatch(deleteMsg(selectedMsgId)); 
      }
   }, [selectedMsgId, dispatch]);

   const messagesList = useMemo(() => {
      return activeChat?.messages || [];
   }, [activeChat?.messages]);

   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messagesList.length]);

   return (
      <UserLayout>
         <div className={styles.chatModel}>
            <div className={styles.sideSpace}></div>
            <div className={styles.mainChat}>
               
               <ChatHeader />

               <div className={styles.messagesBox}>
                  {!chatId && !activeChat ? (
                     <div className={styles.chatLoaderBox}>
                        <div className={styles.spinner}></div>
                        <p>Loading messages...</p>
                     </div>
                  ) : messagesList.length > 0 ? (
                     messagesList.map((msg) => (
                        <MessageItem
                           key={msg?._id || msg?.id}
                           msg={msg}
                           isMyMessage={String(msg.senderId) === String(senderId)}
                           onDeleteClick={handleDeleteClick}
                        />
                     ))
                  ) : (
                     <p className={styles.noMessagesText}>No messages yet. Start the conversation!</p>
                  )}
                  <div ref={messagesEndRef} />
               </div>
                  
               <ChatInput onSendMessage={handleSendMessage} />

            </div>
            <div className={styles.sideSpace}></div>

            {isModalOpen && (
               <div className={styles.modalOverlay}>
                  <div className={styles.modalContainer}>
                     <h3 className={styles.modalTitle}>Want to delete Msg?</h3>
                     <div className={styles.modalActions}>
                        <button
                           onClick={() => setIsModalOpen(false)}
                           className={styles.cancelBtn}
                        >
                           Cancel
                        </button>

                        <button
                           onClick={handleConfirmDelete}
                           className={styles.deleteBtn}
                        >
                           Delete
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </UserLayout>
   );
}