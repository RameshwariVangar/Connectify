import { BASE_URL } from '@/config';
import { getAllUsers, searchUsers } from '@/config/redux/action/authAction'; // 👈 searchUsers action import kiya
import DashBoardLayOut from '@/layout/DashBoardLayOut';
import UserLayout from '@/layout/userLayout';
import React, { useEffect, useState } from 'react'; // 👈 useState add kiya
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.css';
import { useRouter } from 'next/router';

export default function SearchPage() {
  const authState = useSelector((state) => state.auth);
  // Maan lete hain ki search results aapke auth reducer mein 'searchResults' naam se save ho rahe hain
  const searchResults = useSelector((state) => state.auth.searchResults || []);

  const dispatch = useDispatch();
  const router = useRouter();

  // 📝 Input text handle karne ke liye local state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_fetched]);

  // 🔍 Handle input change and API call
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() !== "") {
      // Jab user type kare toh aapka naya createAsyncThunk trigger hoga
      dispatch(searchUsers(value));
    }
  };

  // 🎯 Decision Maker: Kaunsi list dikhani hai?
  // Agar searchQuery khali nahi hai, toh filtered data dikhao, nahi toh saare users dikhao
  const usersToDisplay = searchQuery.trim() !== "" ? searchResults : authState.all_users;

  return (
    <UserLayout>
      <DashBoardLayOut>
        <div className={styles.searchPageContainer}>

          {/* 1. TOP SEARCH BAR SECTION */}
          <div className={styles.searchBarWrapper}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search users by name..."
              className={styles.searchInputField}
            />
          </div>

          {/* 2. USERS LIST SECTION */}
          <div className={styles.allUserProfile}>
            <h1>{searchQuery.trim() !== "" ? "Search Results" : "All Users"}</h1>

            {/* Check condition on data availability */}
            {authState.all_profiles_fetched && usersToDisplay.length > 0 ? (

              usersToDisplay.map((user) => {
                                      //for searchResults   //for authState.all_users    // se res from each for understanding
                const currentUsername = user?.username   || user?.userId?.username;
                const currentName     = user?.name       || user?.userId?.name    ;
                const currentProfilePicture = user?.profilePicture || user?.userId?.profilePicture ;

                return (
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${currentUsername}`);
                    }}
                    key={user._id}
                    className={styles.userCard}
                  >
                    <img src={`${BASE_URL}/${currentProfilePicture}`} alt="" />
                    <div>
                      <h1>{currentName}</h1>
                      <p>{currentUsername}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              // Agar search results mein kuch na mile toh message dikhao
              <h2 className={styles.noResults}>No users found.</h2>
            )}
          </div>

        </div>
      </DashBoardLayOut>
    </UserLayout>
  );
}