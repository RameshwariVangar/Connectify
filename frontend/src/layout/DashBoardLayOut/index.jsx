import React, { useMemo, memo } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAllUsers, selectAllProfilesFetched } from "@/config/redux/selectors/authSelectors";
import { getImageUrl, handleImageError } from "@/utils/imageUtils";

function DashBoardLayOut({ children }) {
      const allUsers = useSelector(selectAllUsers);
      const profilesFetched = useSelector(selectAllProfilesFetched);

      const router = useRouter();

      
      const topProfiles = useMemo(() => {
            if (!profilesFetched || !allUsers || !Array.isArray(allUsers)) return [];
            return allUsers
                  .filter((p) => p && p.userId)
                  .map((p) => ({
                        ...p,
                        postCount: typeof p.postCount === 'number' ? p.postCount : 0
                  }))
                  .sort((a, b) => (b.postCount || 0) - (a.postCount || 0));
      }, [allUsers, profilesFetched]);

      return (
            <div className={styles.container}>

                  <div className={styles.homeContainer}>

                        <div className={styles.homeContainer__leftBar}>

                              <div onClick={() => router.push("/dashboard")} className={styles.sideBarOptions}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                    </svg>
                                    <p>Scroll</p>
                              </div>
                              <div onClick={() => router.push("/search")} className={styles.sideBarOptions}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                    <p>Search</p>
                              </div>
                              <div onClick={() => router.push("/my_connections")} className={styles.sideBarOptions}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    <p>My Connections</p>
                              </div>
                              <div onClick={() => router.push("/getAllChats")} className={styles.sideBarOptions}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                    <p>MyChats</p>
                              </div>

                        </div>

                        <div className={styles.homeCOntainer__feedConatiner}>
                              {children}
                        </div>

                        <div className={styles.homeContainer__extraContainer}>
                              <h1>Top Profiles</h1>
                              {topProfiles.length > 0 ? (
                                    topProfiles.map((profiles) => (
                                          <div 
                                                key={profiles._id} 
                                                className={styles.extraContainer__profile}
                                                onClick={() => router.push(`/view_profile/${profiles.userId.username}`)}
                                                style={{ cursor: "pointer" }}
                                          >
                                                <img 
                                                      src={getImageUrl(profiles.userId.profilePicture)} 
                                                      onError={handleImageError} 
                                                      alt={profiles.userId.name}
                                                      style={{ width: 28, height: 28, borderRadius: "50%", marginRight: 8, objectFit: "cover" }}
                                                />
                                                <p>{profiles.userId.name} <span style={{ fontSize: "0.75rem", color: "#64748b" }}>({profiles.postCount} posts)</span></p>
                                          </div>
                                    ))
                              ) : (
                                    <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Loading top profiles...</p>
                              )}
                        </div>
                  </div>
            </div>
      );
}

export default memo(DashBoardLayOut);