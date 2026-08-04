
import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config/index.jsx";


export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/login", {
                email: user.email,
                password: user.password
            });

            if (response.data.token) {
                console.log("hello");
                localStorage.setItem("token", response.data.token);
            }

            else {
                return thunkAPI.rejectWithValue({
                    message: " token was not provided "
                });
            }

            return thunkAPI.fulfillWithValue(response.data.token);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/register", {
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name,
            })
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }

            return thunkAPI.fulfillWithValue(response.data.token);

        }
        catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)



export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get("/get_user_and_profile", {
                // use params becoz itis get req
                params: {
                    token: user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data)
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/user/get_all_usersprofile");
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }

);

export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnection",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.post("/user/send_connection_requests", {
                token: user.token,
                connectionId: user.connectionId

            });

            thunkAPI.dispatch(getConnectionsRequest({ token: user.token }))
            return thunkAPI.fulfillWithValue(response.data);

        }
        catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);


export const getConnectionsRequest = createAsyncThunk(
    "user/getConnection",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get("/user/getconnectionrequests", {
                params: {
                    token: user.token
                }
            });

            return thunkAPI.fulfillWithValue(response.data);
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
)

export const getMyConnectionReq = createAsyncThunk(
    "user/getMyConnectionReq",
    async (user, thunkAPI) => {

        try {

            console.log(user.token)
            const response = await clientServer.get("/user/my_connection_req", {
                params: {
                    token: user.token
                }
            });

            return thunkAPI.fulfillWithValue(response.data);
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
)

export const AcceptConnection = createAsyncThunk(
    "user/acceptConnection",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.post("/user/accept_connection_req", {
                token: user.token,
                request_id: user.connectionId,
                action_type: user.action
            });

            thunkAPI.dispatch(getConnectionsRequest({ token: user.token }));
            thunkAPI.dispatch(getMyConnectionReq({ token: user.token }));
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
)

export const searchUsers = createAsyncThunk(
    "auth/searchUsers",
    async (searchQuery, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');

            // URL ko chhota rakhenge, baaki sab niche options mein bhejenge
            const res = await clientServer.get('/user/search', {
                headers: {
                    Authorization: `Bearer ${token}`
                },

                params: {
                    query: searchQuery // Axios ise automatically '?query=value' bana dega
                }
            });

            console.log("data : ", res.data);
            return res.data;


        } catch (err) {
            console.log("Actual clientserver:", err.response || err);
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Search failed");
        }
    }
);


export const accessChats = createAsyncThunk(
    "auth/accessChats",
    async ({ receiverId, loggedUserId }, thunkAPI) => {
        try {

            const res = await clientServer.post("/access_Chats", {
                senderId: loggedUserId,
                receiverId: receiverId
            });

            return res.data;

        }
        catch (err) {
            return thunkAPI.rejectWithValue(err.res);
        }
    }
)

export const sendMsg = createAsyncThunk(
    "auth/sendMsg",
    async ({ chatId, sendId, msg }, thunkAPI) => {
        try {
            const res = await clientServer.post("/send_msg", {
                chatId: chatId,
                senderId: sendId,
                messageText: msg
            });
            return res.data; // 🌟 Yeh return karna zaroori hai taaki state update ho sake
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
)

export const getAllChats = createAsyncThunk(
    "auth/getMyChats",
    async (loggedUserId, thunkAPI) => {

        try {

            console.log("loguser", loggedUserId);

            const res = await clientServer.get("/getChats", {
                params: {
                    loggedUserId: loggedUserId
                }
            });

            return res.data;

        }
        catch (err) {
            return thunkAPI.rejectWithValue(err.res.data);
        }
    }
)


export const deleteMsg = createAsyncThunk(
    "auth/deleteChat",
    async (messageId, thunkAPI) => {
           
        console.log(messageId);
        try {

           const res = await clientServer.delete(`/delete_msg`,{
            params:{
                messageId : messageId
            }
           });
             return { ...res.data, messageId: messageId };
         }
        catch (err) {
            return thunkAPI.rejectWithValue(err.res.data);
        }
    }
)


















