import { getImageUrl, handleImageError } from '@/utils/imageUtils';
import { getAllUsers, searchUsers } from '@/config/redux/action/authAction';
import DashBoardLayOut from '@/layout/DashBoardLayOut';
import UserLayout from '@/layout/userLayout';
import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllUsers, selectAllProfilesFetched, selectSearchResults } from '@/config/redux/selectors/authSelectors';
import styles from './index.module.css';
import { useRouter } from 'next/router';

function SearchPage() {
  const allUsers = useSelector(selectAllUsers);
  const profilesFetched = useSelector(selectAllProfilesFetched);
  const searchResults = useSelector(selectSearchResults);

  const dispatch = useDispatch();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!profilesFetched) {
      dispatch(getAllUsers());
    }
  }, [profilesFetched, dispatch]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() !== "") {
      dispatch(searchUsers(value));
    }
  }, [dispatch]);

  const usersToDisplay = useMemo(() => {
    return searchQuery.trim() !== "" ? searchResults : allUsers;
  }, [searchQuery, searchResults, allUsers]);

  return (
    <UserLayout>
      <DashBoardLayOut>
        <div className={styles.searchPageContainer}>

          <div className={styles.searchBarWrapper}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search users by name..."
              className={styles.searchInputField}
            />
          </div>

          <div className={styles.allUserProfile}>
            <h1>{searchQuery.trim() !== "" ? "Search Results" : "All Users"}</h1>

            {profilesFetched && usersToDisplay.length > 0 ? (
              usersToDisplay.map((user) => {
                const currentUsername = user?.username || user?.userId?.username;
                const currentName     = user?.name     || user?.userId?.name;
                const currentPicture  = user?.profilePicture || user?.userId?.profilePicture;

                return (
                  <div
                    onClick={() => {
                      if (currentUsername) {
                        router.push(`/view_profile/${currentUsername}`);
                      }
                    }}
                    key={user._id}
                    className={styles.userCard}
                  >
                    <img 
                      src={getImageUrl(currentPicture)} 
                      onError={handleImageError} 
                      alt={currentName || "user"} 
                    />
                    <div>
                      <h1>{currentName}</h1>
                      <p>@{currentUsername}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <h2 className={styles.noResults}>No users found.</h2>
            )}
          </div>

        </div>
      </DashBoardLayOut>
    </UserLayout>
  );
}

export default memo(SearchPage);