import { createPost, deletePost, getAllComments, getAllPosts, incrementPostLike, postComment } from "@/config/redux/action/postAction";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/userLayout";
import DashBoardLayOut from "@/layout/DashBoardLayOut";
import { setTokenIsThere, setTokenIsNotThere } from "@/config/redux/reducer/authReducer";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { resetPostId } from "@/config/redux/reducer/postReducer";


export default function Dashboard() {

    const router = useRouter();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);
    const postState = useSelector((state) => state.postReducer);


    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            router.push("/login");
        }

        dispatch(setTokenIsThere());
    }, [])

    useEffect(() => {
        if (authState.isTokenThere) {
            dispatch(getAllPosts());
            dispatch(getAboutUser({ token: localStorage.getItem('token') }));
        }
        if (!authState.all_profiles_fetched) {
            dispatch(getAllUsers());
        }
    }, [authState.isTokenThere]);

    console.log("Logged In User Profile:", authState?.user);
    console.log("All Posts Data:", postState?.posts);

    const [postContent, setPostContent] = useState("");
    const [fileContent, setFileContent] = useState();
    const [commentText , setCommentText] = useState("");

    const handleUpload = async () => {
        await dispatch(createPost({ file: fileContent, body: postContent }));
        setFileContent();
        setPostContent("");
        dispatch(getAllPosts());
    }

    if (authState.user) {
        return (
            <UserLayout>
                <DashBoardLayOut>
                    <div className={styles.scrollComponent}>

                        
                        <div className={styles.createPostContainer}>
                            <img className={styles.userProfile} src={`${BASE_URL}/${authState.user.userId.profilePicture}`} alt="profile" />
                            <div className={styles.textareaWrapper}>
                                <textarea 
                                    onChange={(e) => setPostContent(e.target.value)} 
                                    value={postContent} 
                                    placeholder="What's on your mind?" 
                                    className={styles.textareaContent}
                                ></textarea>
                                
                                <div className={styles.createPostActions}>
                                    <label htmlFor="fileUpload" className={styles.fileLabel}>
                                        <div className={styles.Fab}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            {fileContent && <span className={styles.fileSelectedIndicator}>✓ Image Selected</span>}
                                        </div>
                                    </label>
                                    <input onChange={(e) => { setFileContent(e.target.files[0]) }} type="file" hidden id="fileUpload" />
                                    
                                    {postContent.length > 0 &&
                                        <div onClick={handleUpload} className={styles.postButton}>Post</div>
                                    }
                                </div>
                            </div>
                        </div>

                        
                        <div className={styles.postsContainer}>
                            {postState.posts.map((post) => {
                                return (
                                    <div key={post._id} className={styles.singleCard}>
                                        <div className={styles.singleCard__profileContainer}>
                                            <img src={`${BASE_URL}/${post.userId.profilePicture}`} alt="avatar" className={styles.userProfile} />
                                            
                                            <div className={styles.postMainContent}>
                                                <div className={styles.postHeader}>
                                                    <div>
                                                        <p className={styles.profileName}>{post?.userId?.name}</p>
                                                        <p className={styles.profileUsername}>@{post?.userId?.username}</p>
                                                    </div>

                                                    {post.userId._id === authState.user.userId._id && (
                                                        <div
                                                            onClick={async () => {
                                                                alert("Deleting post: " + post._id);
                                                                await dispatch(deletePost({ post_id: post._id }));
                                                                await dispatch(getAllPosts());
                                                            }}
                                                            className={styles.deletePostBtn}
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
                                                        </div>
                                                    )}
                                                </div>

                                                <p className={styles.postBodyText}>{post.body}</p>

                                                {post.media && (
                                                    <div className={styles.singlecard__img}>
                                                        <img src={`${BASE_URL}/${post.media}`} alt="post media" />
                                                    </div>
                                                )}

                                                {/* Interaction Options */}
                                                <div className={styles.optionsContainer}>
                                                    <div onClick={async () => {
                                                        await dispatch(incrementPostLike({post_id : post._id}))
                                                        await dispatch(getAllPosts()) 
                                                    }} className={styles.singleOption__optionsContainer}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                            <path d="M1 8.25a1.25 1.25 0 1 1 2.5 0v7.5a1.25 1.25 0 1 1-2.5 0v-7.5ZM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0 1 14 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 0 1-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 0 1-1.341-.317l-2.734-1.366A3 3 0 0 0 6.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 0 1 2.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388Z" />
                                                        </svg>
                                                        <p>{post.likes}</p>
                                                    </div>
                                                    
                                                    <div onClick={() => {
                                                        dispatch(getAllComments({post_id : post._id}))
                                                    }} className={styles.singleOption__optionsContainer}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                            <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    
                                                    <div onClick={() => {
                                                        const currentUrl = window.location.href;
                                                        if (navigator.share) {
                                                            navigator.share({
                                                                title: "ConnectIn App",
                                                                text: post.body, 
                                                                url: currentUrl  
                                                            }).catch((err) => console.log(err));
                                                        } else {
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
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Comments Side Drawer Overlay */}
                    {postState.postId !== "" &&
                        <div 
                            onClick={() => { dispatch(resetPostId()) }}
                            className={styles.commentsContainer}
                        >
                            <div 
                                onClick={(e) => { e.stopPropagation() }}
                                className={styles.allCommentsContainer}
                            >
                                <div className={styles.commentsHeader}>
                                    <h3>Comments</h3>
                                    <button className={styles.closeCommentsBtn} onClick={() => dispatch(resetPostId())}>✕</button>
                                </div>

                                <div className={styles.commentsListScroll}>
                                    {postState.comment.length === 0 ? (
                                        <h2 className={styles.noCommentsTitle}>No Comments </h2>
                                    ) : (  
                                        <div className={styles.commentsWrap}>
                                            {postState.comment.map((postComment) => {
                                                return ( 
                                                    <div className={styles.singleComment} key={postComment._id}>
                                                        <div className={styles.commentProfileWrap}>
                                                            <img src={`${BASE_URL}/${postComment?.userId?.profilePicture}`} alt="" className={styles.commentAvatar}/>
                                                            <div className={styles.commentMainInfo}>
                                                                <p className={styles.commentUserTitle}>{postComment.userId.name} <span className={styles.commentHandle}>{postComment.userId.username}</span></p>
                                                                <p className={styles.commentBodyText}>{postComment.body}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                                
                                <div className={styles.postCommentContainer}>
                                    <input 
                                        type="text" 
                                        value={commentText} 
                                        onChange={(e) => setCommentText(e.target.value)} 
                                        placeholder="Add a comment..."
                                    />
                                    <div 
                                        onClick={async () => {
                                            if(!commentText.trim()) return;
                                            await dispatch(postComment({post_id: postState.postId , body: commentText }))
                                            setCommentText("");
                                            await dispatch(getAllComments({post_id : postState.postId}))
                                        }} 
                                        className={styles.postCommentContainer__commentBtn}
                                    >
                                        <p>Comment</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </DashBoardLayOut>
            </UserLayout>
        )
    } else {
        return (
            <UserLayout>
                <DashBoardLayOut>
                    <div className={styles.loadingBox}>
                        <div className={styles.spinner}></div>
                        <h2>Loading Dashboard...</h2>
                    </div>
                </DashBoardLayOut>
            </UserLayout>
        )
    }
}