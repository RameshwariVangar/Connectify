import { getAboutUser, getAllChats } from '@/config/redux/action/authAction';
import DashBoardLayOut from '@/layout/DashBoardLayOut';
import UserLayout from '@/layout/userLayout';
import React, { useEffect, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedUserId, selectAllUserChats } from '@/config/redux/selectors/authSelectors';
import { getImageUrl, handleImageError } from '@/utils/imageUtils';
import styles from './index.module.css';
import { useRouter } from 'next/router';

function GetAllChats() {
    const dispatch = useDispatch();
    const router = useRouter();

    const loggedUserId = useSelector(selectLoggedUserId);
    const allUserChats = useSelector(selectAllUserChats);

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem("token")) {
            dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        }
    }, [dispatch]);

    useEffect(() => {
        if (loggedUserId && loggedUserId !== "undefined" && loggedUserId.length === 24) {
            dispatch(getAllChats(loggedUserId));
        }
    }, [loggedUserId, dispatch]);

    const activeChatsOnly = useMemo(() => {
        if (!allUserChats || !Array.isArray(allUserChats)) return [];
        return allUserChats.filter((chat) => chat?.messages && chat?.messages.length > 0);
    }, [allUserChats]);

    return (
        <UserLayout>
            <DashBoardLayOut>
                <div>
                   {activeChatsOnly.length === 0 ? (
                        <p className={styles.emptyMessage}>No active conversations found.</p>
                    ) : (
                        activeChatsOnly.map((chat, index) => {
                            const chatPartner = chat?.participants?.find(
                                (p) => String(p?._id) !== String(loggedUserId)
                            );

                            return (
                                <div 
                                    key={chat._id || index} 
                                    onClick={() => router.push(`/chats/?receiverId=${chatPartner?._id}`)}
                                    className={styles.chatCard}
                                >
                                    <img 
                                        src={getImageUrl(chatPartner?.profilePicture)} 
                                        onError={handleImageError}
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
    );
}

export default memo(GetAllChats);
