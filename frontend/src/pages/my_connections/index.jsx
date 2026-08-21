import { getMyConnectionReq, AcceptConnection, getConnectionsRequest } from '@/config/redux/action/authAction';
import DashBoardLayOut from '@/layout/DashBoardLayOut';
import UserLayout from '@/layout/userLayout';
import React, { useEffect, useMemo, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectConnectionReq, selectConnections } from '@/config/redux/selectors/authSelectors';
import { getImageUrl, handleImageError } from '@/utils/imageUtils';
import styles from './index.module.css';
import { useRouter } from 'next/router';
import { getAllPosts } from '@/config/redux/action/postAction';

function MyConnectionPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const connectionRequests = useSelector(selectConnectionReq);
  const acceptedConnections = useSelector(selectConnections);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      dispatch(getMyConnectionReq({ token }));
      dispatch(getConnectionsRequest({ token }));
      dispatch(getAllPosts());
    }
  }, [dispatch]);

  const pendingRequests = useMemo(() => {
    return (connectionRequests || []).filter((conn) => conn?.status_accepted == null);
  }, [connectionRequests]);

  const acceptedFromReq = useMemo(() => {
    return (connectionRequests || []).filter((conn) => conn?.status_accepted != null);
  }, [connectionRequests]);

  const acceptedFromConn = useMemo(() => {
    return (acceptedConnections || []).filter((conn) => conn?.status_accepted != null);
  }, [acceptedConnections]);

  const pendingConn = useMemo(() => {
    return (acceptedConnections || []).filter((conn) => conn?.status_accepted == null);
  }, [acceptedConnections]);

  const hasNetwork = acceptedFromReq.length > 0 || acceptedFromConn.length > 0;

  const handleAcceptConnection = useCallback((connectionId, e) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      dispatch(AcceptConnection({
        connectionId: connectionId,
        token: localStorage.getItem("token"),
        action: 'accept'
      }));
    }
  }, [dispatch]);

  const handleOpenChat = useCallback((userId, e) => {
    e.stopPropagation();
    router.push(`/chats/?receiverId=${userId}`);
  }, [router]);

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
                  key={user?._id || `pending-${index}`}
                > 
                  <div className={styles.cardContent}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
                      <div className={styles.profilePicture}>
                        <img 
                          src={getImageUrl(user?.userId?.profilePicture)} 
                          onError={handleImageError} 
                          alt=''
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{user?.userId?.name}</h3>
                        <h3>@{user?.userId?.username}</h3>
                      </div>                  
                    </div>
                    <button 
                      onClick={(e) => handleAcceptConnection(user?._id, e)} 
                      className={styles.connectedButton}
                    > 
                      Accept 
                    </button>
                  </div>
                </div>
             ))
          )}

          <hr style={{ margin: "20px 0", borderColor: "#e5e7eb" }} />

          {pendingConn.length === 0 ? (
             <p className={styles.noDataText}>No Req pending Send by you..</p>
          ) : (
             pendingConn.map((user, index) => ( 
              <div key={user?._id || `pending-conn-${index}`}>
                <h3 className={styles.sectionHeading}>Request send by you</h3>
                <div 
                  onClick={() => router.push(`/view_profile/${user?.connectionId?.username}`)} 
                  className={styles.userCard} 
                >  
                  <div className={styles.cardContent}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
                      <div className={styles.profilePicture}>
                        <img 
                          src={getImageUrl(user?.connectionId?.profilePicture)} 
                          onError={handleImageError} 
                          alt=''
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{user?.connectionId?.name}</h3>
                        <h3>@{user?.connectionId?.username}</h3>
                      </div>                  
                    </div>
                    <button onClick={(e) => e.stopPropagation()} className={styles.connectedButton}> Request Send </button>
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
                key={user?._id || `accepted-req-${index}`}
              >
                <div className={styles.cardContent}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
                    <div className={styles.profilePicture}>
                      <img 
                        src={getImageUrl(user?.userId?.profilePicture)} 
                        onError={handleImageError} 
                        alt=''
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user?.userId?.name}</h3>
                      <h3>@{user?.userId?.username}</h3>
                    </div>                  
                  </div>
                  <button 
                    onClick={(e) => handleOpenChat(user?.userId?._id, e)} 
                    className={styles.chatButton}
                  >
                    Chat
                  </button>
                </div>
              </div>
          ))}

          {acceptedFromConn.map((user, index) => ( 
              <div 
                onClick={() => router.push(`/view_profile/${user?.connectionId?.username}`)} 
                className={styles.userCard} 
                key={user?._id || `accepted-conn-${index}`}
              >
                <div className={styles.cardContent}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
                    <div className={styles.profilePicture}>
                      <img 
                        src={getImageUrl(user?.connectionId?.profilePicture)} 
                        onError={handleImageError} 
                        alt=''
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user?.connectionId?.name}</h3>
                      <h3>@{user?.connectionId?.username}</h3>
                    </div>                  
                  </div>
                  <button 
                    onClick={(e) => handleOpenChat(user?.connectionId?._id, e)} 
                    className={styles.chatButton}
                  >
                    Chat
                  </button>
                </div>
              </div>
          ))}
          
        </div>
      </DashBoardLayOut>
    </UserLayout>
  );
}

export default memo(MyConnectionPage);