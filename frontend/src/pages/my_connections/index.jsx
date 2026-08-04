import { getMyConnectionReq , AcceptConnection, getConnectionsRequest} from '@/config/redux/action/authAction';
import DashBoardLayOut from '@/layout/DashBoardLayOut'
import UserLayout from '@/layout/userLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.css'
import { BASE_URL } from "@/config";
import { useRouter } from 'next/router';
import { getAllPosts } from '@/config/redux/action/postAction';

export default function MyConnectionPage() {

  const dispatch = useDispatch();
  const authState = useSelector((state)=> state.auth);
  const router = useRouter();

  useEffect(()=>{
    dispatch(getMyConnectionReq({ token: localStorage.getItem("token") }));
    dispatch(getConnectionsRequest({token: localStorage.getItem("token")}));
    dispatch(getAllPosts());
  }, [dispatch]);

  const connectionRequests = authState?.connectionReq || [];
  const acceptedConnections = authState?.connections || [];

  const pendingRequests = connectionRequests.filter((conn) => conn?.status_accepted == null);
  const acceptedFromReq = connectionRequests.filter((conn) => conn?.status_accepted != null);
  const acceptedFromConn = acceptedConnections.filter((conn) => conn?.status_accepted != null);
  const pendingConn = acceptedConnections.filter((conn)=>conn?.status_accepted == null);

  const hasNetwork = acceptedFromReq.length > 0 || acceptedFromConn.length > 0;

  return (
    <UserLayout>
      <DashBoardLayOut>
        <div className={styles.pageContainer}>
          <h2 className={styles.sectionHeading}>My Connections</h2>
          
          {pendingRequests.length === 0 ? (
             <p className={styles.noDataText}>No connection request pending..</p>
          ) : (  
             pendingRequests.map((user, index) => ( 
                <div 
                  onClick={() => router.push(`/view_profile/${user?.userId?.username}`)} 
                  className={styles.userCard} 
                  key={`pending-${index}`}
                > 
                  <div className={styles.cardContent}>
                    <div style={{display:"flex", alignItems:"center" , gap:"1.4rem"}}>
                      <div className={styles.profilePicture}>
                        <img src={`${BASE_URL}/${user?.userId?.profilePicture}`} alt=''/>
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{user?.userId?.name}</h3>
                        <h3>{user?.userId?.username}</h3>
                      </div>                  
                    </div>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      dispatch(AcceptConnection({
                        connectionId: user?._id,
                        token: localStorage.getItem("token"),
                        action: 'accept'
                      }));
                    }} className={styles.connectedButton}> Accept </button>
                  </div>
                </div>
             ))
          )}

          <hr style={{ margin: "20px 0", borderColor: "#e5e7eb" }} />

          {pendingConn.length === 0 ? (
             <p className={styles.noDataText}>No Req pending Send by you..</p>
          ) : (
             pendingConn.map((user, index) => ( 
              <div key={`pending-conn-${index}`}>
                <h3 className={styles.sectionHeading}>Request send by you</h3>
                <div 
                  onClick={() => router.push(`/view_profile/${user?.connectionId?.username}`)} 
                  className={styles.userCard} 
                >  
                  <div className={styles.cardContent}>
                    <div style={{display:"flex", alignItems:"center" , gap:"1.4rem"}}>
                      <div className={styles.profilePicture}>
                        <img src={`${BASE_URL}/${user?.connectionId?.profilePicture}`} alt=''/>
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{user?.connectionId?.name}</h3>
                        <h3>{user?.connectionId?.username}</h3>
                      </div>                  
                    </div>
                    <button onClick={(e) => {
                      e.stopPropagation();
                    }} className={styles.connectedButton}> Request Send </button>
                  </div>
                </div>
              </div>
             ))
          )}

          <hr style={{ margin: "20px 0", borderColor: "#e5e7eb" }} />

          {hasNetwork && <h4 className={styles.sectionHeading}>My Network</h4>}

          {acceptedFromReq.map((user, index) => ( 
              <div 
                onClick={() => router.push(`/view_profile/${user?.userId?.username}`)} 
                className={styles.userCard} 
                key={`accepted-req-${index}`}
              >
                <div className={styles.cardContent}>
                  <div style={{display:"flex", alignItems:"center" , gap:"1.4rem"}}>
                    <div className={styles.profilePicture}>
                      <img src={`${BASE_URL}/${user?.userId?.profilePicture}`} alt=''/>
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user?.userId?.name}</h3>
                      <h3>{user?.userId?.username}</h3>
                    </div>                  
                  </div>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/chats/?receiverId=${user?.userId?._id}`);
                  }} className={styles.chatButton}>Chat</button>
                </div>
              </div>
          ))}

          {acceptedFromConn.map((user, index) => ( 
              <div 
                onClick={() => router.push(`/view_profile/${user?.connectionId?.username}`)} 
                className={styles.userCard} 
                key={`accepted-conn-${index}`}
              >
                <div className={styles.cardContent}>
                  <div style={{display:"flex", alignItems:"center" , gap:"1.4rem"}}>
                    <div className={styles.profilePicture}>
                      <img src={`${BASE_URL}/${user?.connectionId?.profilePicture}`} alt=''/>
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user?.connectionId?.name}</h3>
                      <h3>{user?.connectionId?.username}</h3>
                    </div>                  
                  </div>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/chats/?receiverId=${user?.connectionId?._id}`);
                  }} className={styles.chatButton}>Chat</button>
                </div>
              </div>
          ))}
          
        </div>
      </DashBoardLayOut>
    </UserLayout>
  )
}