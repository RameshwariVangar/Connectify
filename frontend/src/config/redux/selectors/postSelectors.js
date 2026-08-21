import { createSelector } from '@reduxjs/toolkit';

const selectPostReducerState = (state) => state.postReducer;

export const selectPosts = createSelector(
   [selectPostReducerState],
   (postState) => postState?.posts || []
);

export const selectPostComments = createSelector(
   [selectPostReducerState],
   (postState) => postState?.comment || []
);

export const selectActivePostId = createSelector(
   [selectPostReducerState],
   (postState) => postState?.postId || ""
);

export const selectPostLoading = createSelector(
   [selectPostReducerState],
   (postState) => Boolean(postState?.isLoading)
);

export const selectPostFetched = createSelector(
   [selectPostReducerState],
   (postState) => Boolean(postState?.postFetched)
);
