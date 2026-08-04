import { accessChats, getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionReq, loginUser, registerUser, searchUsers, sendMsg, getAllChats, deleteChat, deleteMsg } from "../../action/authAction";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   user: undefined,
   isError: false,
   isSuccess: false,
   isLoading: false,
   loggedIn: false,
   message: "",
   isTokenThere: false,
   profileFetched: false,
   connections: [],
   connectionReq: [],
   all_users: [],
   all_profiles_fetched: false,
   searchResults: [],
   activeChat: null,
   getMyChat: null
}
const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      reset: () => initialState,
      handleLoginUser: (state) => {
         state.message = "hello"
      },
      emptyMessage: (state) => {
         state.message = "";
      },
      setTokenIsThere: (state) => {
         state.isTokenThere = true;
      },
      setTokenIsNotThere: (state) => {
         state.isTokenThere = false;
      },
      clearActiveChat: (state) => {
         state.activeChat = null;
      }
   },
   extraReducers: (builder) => {

      builder
         .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.message = "knocking the door.....";
         })
         .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = "login is sucessfull";

         })
         .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload.message;
         })
         .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.message = "Registering You Are";
         })
         .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = "Registration is sucessfull";
         })
         .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload?.message || action.error?.message || "Something went wrong";
         })
         .addCase(getAboutUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            state.user = action.payload.userProfile;
         })
         .addCase(getAllUsers.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.all_profiles_fetched = true;
            state.all_users = action.payload.profiles;
         })
         .addCase(getConnectionsRequest.fulfilled, (state, action) => {
            state.connections = action.payload
         })
         .addCase(getConnectionsRequest.rejected, (state, action) => {
            state.message = action.payload
         })
         .addCase(getMyConnectionReq.fulfilled, (state, action) => {
            state.connectionReq = action.payload
            console.log("from reducer :", action.payload);
         })
         .addCase(getMyConnectionReq.rejected, (state, action) => {
            state.message = action.payload
         })
         .addCase(searchUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.searchResults = action.payload;
         })
         .addCase(searchUsers.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(searchUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
         })
         .addCase(accessChats.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
         })
         .addCase(accessChats.fulfilled, (state, action) => {
            state.isLoading = false;
            state.activeChat = action.payload; // 🔥 Boom! Payload yahan save ho gaya
            state.isError = null;
         })
         .addCase(sendMsg.fulfilled, (state, action) => {
            state.isError = false;
            state.activeChat = action.payload;
         })
         .addCase(getAllChats.fulfilled, (state, action) => {
            state.isError = false;
            state.getMyChat = action.payload;
         })
         // .addCase(deleteMsg.fulfilled, (state, action) => {
         //    state.isLoading = false;
         //       if (state.activeChat && state.activeChat.messages) {
         //          state.activeChat.messages = state.activeChat.messages.filter(
         //             (msg) => msg._id !== action.payload.messageId
         //          );
         //       }
         //    })
         

   }
});

export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere } = authSlice.actions;  // it is inbuild object 

export default authSlice.reducer;