import { getAboutUser } from '@/config/redux/action/authAction';
import DashBoardLayOut from '@/layout/DashBoardLayOut'
import UserLayout from '@/layout/userLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.css'
import { BASE_URL, clientServer } from '@/config';
import { getAllPosts } from '@/config/redux/action/postAction';
import { current } from '@reduxjs/toolkit';

export default function profilePage() {

    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer);

    const dispatch = useDispatch();
    const [userProfile, setUserProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalForEdu, setModalForEdu] = useState(false);

    const [inputData, setInputData] = useState({ company: '', position: '', years: '' });
    const [inputEdu, setInputEdu] = useState({ school: '', degree: '', fieldOfStudy: '' });

    const handleWorkInputChange = (e) => {
        const { name, value } = e.target;
        setInputData({ ...inputData, [name]: value });
    }

    const handleInputChangeEdu = (e) => {
        const { name, value } = e.target;
        setInputEdu({ ...inputEdu, [name]: value });
    }

    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }))
        dispatch(getAllPosts());
    }, [])

    useEffect(() => {
        if (authState?.user) {
            setUserProfile(authState.user);
            let post = postReducer.posts.filter((post) => {
                return post.userId.username === authState.user.userId.username
            })
            setUserPosts(post);
        }
    }, [authState.user, postReducer.posts]);

    const updateProfilePicture = async (file) => {
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("token", localStorage.getItem("token"));

        const response = await clientServer.post(`/upload_profile_picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }

    const updateProfileData = async () => {
        const request = await clientServer.post("/user_update", {
            token: localStorage.getItem("token"),
            name: userProfile.userId.name
        });

        const response = await clientServer.post("/update_profile_data", {
            token: localStorage.getItem("token"),
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork: userProfile.pastWork,
            education: userProfile.education
        });

        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }

    if (authState.user) {
        return (
            <UserLayout>
                <DashBoardLayOut>
                    {authState.user && userProfile.userId &&
                        <div className={styles.container}>
                            
                            <div className={styles.profileHeroCard}>
                                <div className={styles.backDropContainer}>
                                    <label htmlFor='profilePicUpdate' className={styles.backDrop__overlay}>
                                        <span>Edit Picture</span>
                                    </label>
                                    <input onChange={(e) => {
                                        updateProfilePicture(e.target.files[0]);
                                    }} hidden type='file' id='profilePicUpdate'></input>
                                    <img className={styles.backDropImage} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backDrop"></img>
                                </div>

                                <div className={styles.avatarRow}>
                                    <div className={styles.avatarWrapper}>
                                        <img className={styles.mainAvatar} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="Avatar" />
                                    </div>
                                    <div className={styles.downloadRow}>
                                        <div onClick={async () => {
                                            const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                                            window.open(`${BASE_URL}/${response.data.message}`, "_blank")
                                        }} className={styles.resumeBtn} title="Download Resume">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                            </svg>
                                            <span>Resume</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.profileMetaInputs}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.fieldLabel}>Username</label>
                                        <input className={styles.usernameInput} type='text' value={userProfile.userId.username} onChange={(e) => {
                                            setUserProfile({ ...userProfile, userId: { ...userProfile.userId, username: e.target.value } })
                                        }} />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.fieldLabel}>Full Name</label>
                                        <input className={styles.nameEditInput} type='text' value={userProfile.userId.name} onChange={(e) => {
                                            setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })
                                        }} />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.fieldLabel}>Bio</label>
                                        <textarea className={styles.bioTextarea} value={userProfile.bio}
                                            onChange={(e) => {
                                                setUserProfile({ ...userProfile, bio: e.target.value });
                                            }}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.detailsSectionCard}>
                                <h4 className={styles.sectionHeading}>Work History</h4>
                                <div className={styles.listStack}>
                                    {userProfile.pastWork?.map((work, index) => {
                                        if (!work || !work.company) return null;
                                        return (
                                            <div key={index} className={styles.infoRowCard}>
                                                <div className={styles.infoCardMeta}>
                                                    <span className={styles.boldDesignation}>{work.position}</span>
                                                    <span className={styles.companyBadge}>{work.company}</span>
                                                </div>
                                                <p className={styles.durationText}>{work.years}</p>
                                            </div>
                                        );
                                    })}
                                    <button className={styles.addNewItemBtn} onClick={() => setIsModalOpen(true)}>
                                        + Add Work Experience
                                    </button>
                                </div>
                            </div>

                            <div className={styles.detailsSectionCard}>
                                <h4 className={styles.sectionHeading}>Education</h4>
                                <div className={styles.listStack}>
                                    {userProfile.education?.map((edu, index) => {
                                        if (!edu || !edu.school) return null;
                                        return (
                                            <div key={index} className={styles.infoRowCard}>
                                                <h5 className={styles.institutionName}>{edu.school}</h5>
                                                <p className={styles.degreeDetailsText}>{edu.degree} — <span className={styles.fieldStudySpan}>{edu.fieldOfStudy}</span></p>
                                            </div>
                                        );
                                    })}
                                    <button className={styles.addNewItemBtn} onClick={() => setModalForEdu(true)}>
                                        + Add Education
                                    </button>
                                </div>
                            </div>

                            <div className={styles.detailsSectionCard}>
                                <h4 className={styles.sectionHeading}>Recent Activity</h4>
                                <div className={styles.activityFeedStack}>
                                    {userPosts.map((post, postIndex) => {
                                        return (
                                            <div key={postIndex} className={styles.activityPostCard}>
                                                <div className={styles.postHeader}>
                                                    <img className={styles.postAvatar} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="User Avatar" />
                                                    <div className={styles.postUserInfo}>
                                                        <span className={styles.postUserNameText}>{userProfile.userId.name}</span>
                                                        <span className={styles.postUserHandleText}>@{userProfile.userId.username}</span>
                                                    </div>
                                                </div>
                                                
                                                <p className={styles.postMainBodyText}>{post.body}</p>
                                                
                                                {post.media !== "" && (
                                                    <div className={styles.postImageWrapper}>
                                                        <img src={`${BASE_URL}/${post.media}`} alt="media" />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {userProfile != authState.user &&
                                <button onClick={updateProfileData} className={styles.saveProfileMainBtn}>
                                    Update Profile Changes
                                </button>
                            }

                        </div>
                    }

                    {isModalOpen &&
                        <div onClick={() => setIsModalOpen(false)} className={styles.modalOverlay}>
                            <div onClick={(e) => e.stopPropagation()} className={styles.modalBodyContainer}>
                                <h3 className={styles.modalTitleText}>Add Work Experience</h3>
                                <input onChange={handleWorkInputChange} value={inputData.company} name='company' className={styles.modalInputField} type="text" placeholder="Company Name" />
                                <input onChange={handleWorkInputChange} value={inputData.position} name='position' className={styles.modalInputField} type="text" placeholder="Position / Role" />
                                <input onChange={handleWorkInputChange} value={inputData.years} name='years' className={styles.modalInputField} type="text" placeholder="Duration (e.g. 2022 - 2024)" />
                                <div className={styles.modalActionRow}>
                                    <button onClick={() => setIsModalOpen(false)} className={styles.modalCancelBtn}>Cancel</button>
                                    <button onClick={() => {
                                        setUserProfile({ ...userProfile, pastWork: [...(userProfile.pastWork || []), inputData] });
                                        setInputData({ company: '', position: '', years: '' });
                                        setIsModalOpen(false);
                                    }} className={styles.modalSubmitBtn}>Save Work</button>
                                </div>
                            </div>
                        </div>
                    }

                    {modalForEdu &&
                        <div onClick={() => setModalForEdu(false)} className={styles.modalOverlay}>
                            <div onClick={(e) => e.stopPropagation()} className={styles.modalBodyContainer}>
                                <h3 className={styles.modalTitleText}>Add Education</h3>
                                <input onChange={handleInputChangeEdu} value={inputEdu.school} name='school' className={styles.modalInputField} type="text" placeholder="School / University Name" />
                                <input onChange={handleInputChangeEdu} value={inputEdu.degree} name='degree' className={styles.modalInputField} type="text" placeholder="Degree (e.g. B.Tech)" />
                                <input onChange={handleInputChangeEdu} value={inputEdu.fieldOfStudy} name='fieldOfStudy' className={styles.modalInputField} type="text" placeholder="Field of Study (e.g. Computer Science)" />
                                <div className={styles.modalActionRow}>
                                    <button onClick={() => setModalForEdu(false)} className={styles.modalCancelBtn}>Cancel</button>
                                    <button onClick={() => {
                                        setUserProfile({ ...userProfile, education: [...(userProfile.education || []), inputEdu] });
                                        setInputEdu({ school: '', degree: '', fieldOfStudy: '' });
                                        setModalForEdu(false);
                                    }} className={styles.modalSubmitBtn}>Save Education</button>
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
                    <div className={styles.loadingStateScreen}>
                        <h2>Loading Profile...</h2>
                    </div>
                </DashBoardLayOut>
            </UserLayout>
        )
    }
}