import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    email: "",
    contact: "",
    accessToken: "",
    refreshToken: "",
  },
  reducers: {
    setUserSlice: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.name = user.name;
      state.contact = user.contact;
      state.email = user.email;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    logout: (state) => {
      state.name = "";
      state.contact = "";
      state.email = "";
      state.accessToken = "";
      state.refreshToken = "";
    },
  },
});

export const { setUserSlice, logout } = userSlice.actions;
export default userSlice.reducer;
