import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        name: "",
        id: "",
        email: "",
        contact: "",
        notes: [],
        summaries: [],
        accessToken: "",
        refreshToken: "",
    },
    reducers: {
        setUserSlice: (state, action) => {
            const { user, accessToken, refreshToken } = action.payload;
            state.name = user.name;
            state.id = user._id;
            state.notes = user.notes;
            state.summaries = user.summaries;
            state.email = user.email;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
        },
        logout: (state) => {
            state.name = "";
            state.contact = "";
            state.id = "";
            state.notes = [];
            state.summaries = [];
            state.email = "";
            state.accessToken = "";
            state.refreshToken = "";
        },
    },
});

export const { setUserSlice, logout } = userSlice.actions;
export default userSlice.reducer;
