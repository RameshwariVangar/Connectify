import NavbarComponent from '@/Components/Navbar'
import DashBoardLayOut from '@/layout/DashBoardLayOut'
import UserLayout from '@/layout/userLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser, accessChats, sendMsg, deleteChat, deleteMsg } from '@/config/redux/action/authAction'
import { useRouter } from 'next/router'
import styles from './index.module.css'
import { BASE_URL } from '@/config'


export default function () {


   const dispatch = useDispatch();
   const router = useRouter();
   const authState = useSelector((state) => state.auth);

   const { receiverId } = router.query;
   const loggedUser = authState.user;

   const [receiver, setReceiver] = useState(null);
   const [text, setText] = useState("");

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedMsgId, setSelectedMsgId] = useState(null);


   useEffect(() => {
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
   }, [dispatch]);

   const senderId = loggedUser?.userId?._id;
   const chatId = authState.activeChat?._id;


   useEffect(() => {
      if (authState.activeChat?.participants && senderId) {

         const foundReceiver = authState.activeChat.participants.find(p => p?.username != loggedUser.userId.username);
         setReceiver(foundReceiver);
         console.log("Receiver details updated in state:", foundReceiver);
      }
   }, [authState.activeChat, senderId]);



   useEffect(() => {
      if (senderId && receiverId) {
         console.log("Dispatching IDs to backend -> Sender:", senderId, "Receiver:", receiverId);

         dispatch(accessChats({
            loggedUserId: senderId,
            receiverId: receiverId
         }));
      }
   }, [senderId, receiverId, dispatch]);

   const handleSendMessage = () => {
      if (!text.trim()) return; 
      if (!chatId || !senderId) return console.log("Missing ChatId or SenderId");

      dispatch(sendMsg({
         chatId: chatId,
         sendId: senderId,
         msg: text
      })).then(() => {
         console.log("Message sent! Now refetching populated chat details...");
         dispatch(accessChats({
            loggedUserId: senderId,
            receiverId: receiverId
         }))
      });

      setText(""); 

   };

   const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
         handleSendMessage();
      }
   };

   return (
      <UserLayout>

         <div className={styles.chatModel}>
            <div className={styles.sideSpace}></div>
            <div className={styles.mainChat}>
               <div className={styles.receiver}>
                  {receiver ? (
                     <>
                        <img
                           src={receiver?.profilePicture ? `${BASE_URL}/${receiver.profilePicture}` : "/default-avatar.png"}
                           alt="profile"
                           className={styles.receiverAvatar}
                        />
                        <h3 className={styles.receiverName}>{receiver?.name} (@{receiver?.username})</h3>
                     </>
                  ) : (
                     <div className={styles.headerLoader}>
                        <div className={styles.spinnerMini}></div>
                        <h3>Loading conversation details...</h3>
                     </div>
                  )}
               </div>
               <div className={styles.messagesBox}>
                  {!chatId ? (
                     <div className={styles.chatLoaderBox}>
                        <div className={styles.spinner}></div>
                        <p>Loading messages...</p>
                     </div>
                  ) : authState.activeChat?.messages && authState.activeChat.messages.length > 0 ? (

                     authState.activeChat.messages.map((msg, index) => (
                        <div key={index} className={msg.senderId === senderId ? styles.myMessage : styles.theirMessage}>
                           <div className={styles.msgContent}>
                              <p>{msg.messageText}</p>
                              <button 
                                 className={styles.deleteIconBtn}
                                 onClick={() => {
                                    setSelectedMsgId(msg?._id || msg?.id);
                                    setIsModalOpen(true);
                                 }}
                              >
                                 <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth={1.5} 
                                    stroke="currentColor"
                                 >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                 </svg>
                              </button>
                           </div>
                        </div>
                     ))
                  ) : (
                     <p className={styles.noMessagesText}>No messages yet. Start the conversation!</p>
                  )}
               </div>

               <div className={styles.inputArea}>
                  <input
                     type="text"
                     placeholder="Type your message here..."
                     value={text} 
                     onChange={(e) => setText(e.target.value)} 
                     onKeyDown={handleKeyPress} 
                  />
                  <button type="button" onClick={handleSendMessage}>Send</button>
               </div>

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
                           onClick={async () => {
                              setIsModalOpen(false); 
                              await dispatch(deleteMsg(selectedMsgId)); 
                              dispatch(accessChats({
                                 loggedUserId: senderId,
                                 receiverId: receiverId
                              }))
                           }}
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

   )
}