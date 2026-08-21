import { createSelector } from '@reduxjs/toolkit';

const selectAuthState = (state) => state.auth;

export const selectLoggedUser = createSelector(
   [selectAuthState],
   (auth) => auth?.user
);

export const selectLoggedUserId = createSelector(
   [selectLoggedUser],
   (user) => user?.userId?._id || user?._id || null
);

export const selectLoggedUsername = createSelector(
   [selectLoggedUser],
   (user) => user?.userId?.username || user?.username || ''
);

export const selectLoggedUserName = createSelector(
   [selectLoggedUser],
   (user) => user?.userId?.name || user?.name || ''
);

export const selectProfileFetched = createSelector(
   [selectAuthState],
   (auth) => Boolean(auth?.profileFetched)
);

export const selectIsTokenThere = createSelector(
   [selectAuthState],
   (auth) => Boolean(auth?.isTokenThere)
);

export const selectActiveChat = createSelector(
   [selectAuthState],
   (auth) => auth?.activeChat || null
);

export const selectActiveChatId = createSelector(
   [selectActiveChat],
   (activeChat) => activeChat?._id || null
);

export const selectActiveChatMessages = createSelector(
   [selectActiveChat],
   (activeChat) => activeChat?.messages || []
);

export const selectAllUserChats = createSelector(
   [selectAuthState],
   (auth) => auth?.getMyChat || []
);

export const selectAllUsers = createSelector(
   [selectAuthState],
   (auth) => auth?.all_users || []
);

export const selectAllProfilesFetched = createSelector(
   [selectAuthState],
   (auth) => Boolean(auth?.all_profiles_fetched)
);

export const selectSearchResults = createSelector(
   [selectAuthState],
   (auth) => auth?.searchResults || []
);

export const selectConnectionReq = createSelector(
   [selectAuthState],
   (auth) => auth?.connectionReq || []
);

export const selectConnections = createSelector(
   [selectAuthState],
   (auth) => auth?.connections || []
);

export const selectAuthLoading = createSelector(
   [selectAuthState],
   (auth) => Boolean(auth?.isLoading)
);

export const selectAuthMessage = createSelector(
   [selectAuthState],
   (auth) => auth?.message || ''
);

export const selectAuthIsError = createSelector(
   [selectAuthState],
   (auth) => Boolean(auth?.isError)
);

export const selectAuthLoggedIn = createSelector(
   [selectAuthState],
   (auth) => Boolean(auth?.loggedIn)
);
