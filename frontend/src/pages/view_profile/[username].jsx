import { clientServer } from "@/config";
import DashBoardLayOut from "@/layout/DashBoardLayOut";
import UserLayout from "@/layout/userLayout";
import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import styles from './index.module.css';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, incrementPostLike, getAllComments } from "@/config/redux/action/postAction";
import { getConnectionsRequest, sendConnectionRequest, getAboutUser } from "@/config/redux/action/authAction";
import { selectLoggedUser, selectConnections } from "@/config/redux/selectors/authSelectors";
import { selectPosts } from "@/config/redux/selectors/postSelectors";
import { getImageUrl, handleImageError } from "@/utils/imageUtils";

function ViewProfilePage({ userProfile }) {
    const router = useRouter();
    const dispatch = useDispatch();

    const loggedUser = useSelector(selectLoggedUser);
    const connections = useSelector(selectConnections);
    const allPosts = useSelector(selectPosts);

    const [isCurrentUserInConnection, setIsCurrentInConnection] = useState(false);
    const [isConnectionNull, setIsConnectionNull] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
   
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

    const getUserPost = useCallback(async () => {
        if (typeof window !== 'undefined' && localStorage.getItem("token")) {
            const token = localStorage.getItem("token");
            await dispatch(getAllPosts());
            await dispatch(getConnectionsRequest({ token }));
            await dispatch(getAboutUser({ token }));
        }
    }, [dispatch]);

    useEffect(() => {
        getUserPost();
    }, [getUserPost]);

    const userPosts = useMemo(() => {
        const username = router.query.username;
        if (!username || !allPosts) return [];
        return allPosts.filter((post) => post?.userId?.username === username);
    }, [allPosts, router.query.username]);

    useEffect(() => {
        if (!userProfile?.userId?._id) return;

        const myId = loggedUser?.userId?._id || loggedUser?._id;
        const currentProfileId = userProfile.userId._id;

        if (myId && currentProfileId && String(myId) === String(currentProfileId)) {
            setIsOwnProfile(true);
            setIsCurrentInConnection(false);
            setIsConnectionNull(true);
            return;
        }

        setIsOwnProfile(false);

        if (connections) {
            const isConnected = connections.some(user => {
                const targetId = user?.connectionId?._id || user?.connectionId;
                return String(targetId) === String(currentProfileId);
            });

            setIsCurrentInConnection(isConnected);

            const acceptedConnection = connections.find(user => {
                const targetId = user?.connectionId?._id || user?.connectionId;
                return String(targetId) === String(currentProfileId);
            });

            if (acceptedConnection && acceptedConnection.status_accepted === true) {
                setIsConnectionNull(false);
            } else {
                setIsConnectionNull(true);
            }
        }
    }, [connections, loggedUser, userProfile]);

    const avatarUrl = getImageUrl(userProfile?.userId?.profilePicture);

    return (
        <UserLayout>
            <DashBoardLayOut>
                <div className={styles.container}>
                    
                    <div className={styles.profileHeroCard}>
                        <div className={styles.backDropContainer}>
                            <img className={styles.backDrop} src={avatarUrl} onError={handleImageError} alt="backDrop" />
                        </div>
                        
                        <div className={styles.avatarActionRow}>
                            <div className={styles.avatarWrapper}>
                                <img className={styles.profileMainAvatar} src={avatarUrl} onError={handleImageError} alt="Avatar" />
                            </div>
                            
                            <div className={styles.actionButtonsWrapper}>
                                {isOwnProfile ? (
                                    <button className={styles.editProfileBtn}>Your Profile</button> 
                                ) : isCurrentUserInConnection ? (
                                    <button className={styles.connectedButton}>{isConnectionNull ? "Pending" : "Connected"}</button>
                                ) : (
                                    <button onClick={() => {
                                        dispatch(sendConnectionRequest({ token: localStorage.getItem("token"), connectionId: userProfile.userId._id }))
                                    }} className={styles.connectBtn}>Connect</button>
                                )}

                                <div onClick={async () => {
                                    const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                                    if (response.data?.message) {
                                        window.open(getImageUrl(response.data.message), "_blank");
                                    }
                                }} className={styles.resumeDownloadIconBox} title="Download Resume">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className={styles.profileTextDetails}>
                            <div className={styles.nameHeaderGroup}>
                                <h2 className={styles.primaryName}>{userProfile?.userId?.name}</h2>
                                <p className={styles.secondaryUsername}>@{userProfile?.userId?.username}</p>
                            </div>
                            <p className={styles.bioText}>{userProfile?.bio}</p>
                        </div>
                    </div>

                    <div className={styles.verticalContentStack}>
                        
                        <div className={styles.detailsCardSection}>
                            <h4 className={styles.cardSectionTitle}>Work History</h4>
                            <div className={styles.listContainer}>
                                {userProfile?.pastWork?.map((work, index) => (
                                    <div key={index} className={styles.experienceCard}>
                                        <div className={styles.cardHeaderRow}>
                                            <span className={styles.boldDesignation}>{work.position}</span>
                                            <span className={styles.companyBadge}>{work.company}</span>
                                        </div>
                                        <p className={styles.durationText}>{work.years}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className={styles.detailsCardSection}>
                            <h4 className={styles.cardSectionTitle}>Education</h4>
                            <div className={styles.listContainer}>
                                {userProfile?.education?.map((edu, index) => (
                                    <div key={index} className={styles.educationCard}>
                                        <h5 className={styles.schoolName}>{edu.school}</h5>
                                        <p className={styles.degreeDetails}>{edu.degree} — <span className={styles.fieldOfStudy}>{edu.fieldOfStudy}</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.detailsCardSection}>
                            <h4 className={styles.cardSectionTitle}>Recent Activity</h4>
                            <div className={styles.activityList}>
                                {userPosts.map((post, postIndex) => (
                                    <div key={post._id || postIndex} className={styles.activityPostCard}>
                                        {post.media && post.media !== "" ? (
                                            <div className={styles.postMediaContainer}>
                                                <img src={getImageUrl(post.media)} onError={handleImageError} alt="media" />
                                            </div>
                                        ) : null}
                                        <p className={styles.postBodyText}>{post.body}</p>

                                        <div className={styles.optionsContainer}>
                                            <div onClick={async () => {
                                                await dispatch(incrementPostLike({ post_id: post._id }));
                                                await dispatch(getAllPosts());
                                            }} className={styles.singleOption__optionsContainer}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                    <path d="M1 8.25a1.25 1.25 0 1 1 2.5 0v7.5a1.25 1.25 0 1 1-2.5 0v-7.5ZM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0 1 14 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 0 1-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 0 1-1.341-.317l-2.734-1.366A3 3 0 0 0 6.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 0 1 2.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388Z" />
                                                </svg>
                                                <p>{post.likes}</p>
                                            </div>

                                            <div onClick={() => {
                                                dispatch(getAllComments({ post_id: post._id }));
                                                setIsCommentModalOpen(true);
                                            }} className={styles.singleOption__optionsContainer}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                    <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                                                </svg>
                                            </div>

                                            <div onClick={() => {
                                                const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: "Connectify App",
                                                        text: post.body, 
                                                        url: currentUrl  
                                                    }).catch(() => {});
                                                } else if (navigator.clipboard) {
                                                    navigator.clipboard.writeText(currentUrl);
                                                    alert("Link copied!");
                                                }
                                            }} className={styles.singleOption__optionsContainer}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                    <path d="M13 4.5a2.5 2.5 0 1 1 .702 1.737L6.97 9.604a2.518 2.518 0 0 1 0 .792l6.733 3.367a2.5 2.5 0 1 1-.671 1.341l-6.733-3.367a2.5 2.5 0 1 1 0-3.475l6.733-3.366A2.52 2.52 0 0 1 13 4.5Z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {isCommentModalOpen && (
                        <div className={styles.modalOverlay} onClick={() => setIsCommentModalOpen(false)}>
                            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <div className={styles.modalHeader}>
                                    <h3>Comments</h3>
                                    <button className={styles.closeModalBtn} onClick={() => setIsCommentModalOpen(false)}>
                                        &times;
                                    </button>
                                </div>
                                <div className={styles.modalBody}>
                                    <div className={styles.placeholderContainer}>
                                        <p className={styles.placeholderText}>Comments stream is active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </DashBoardLayOut>
        </UserLayout>
    );
}

export async function getServerSideProps(context) {
    const request = await clientServer.get("/user/get_profile_based_on_username", {
        params: {
            username: context.query.username
        }
    });

    return { props: { userProfile: request.data.profile } };
}

export default memo(ViewProfilePage);