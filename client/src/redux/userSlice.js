import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    email: "",
    accessToken: "",
    refreshToken: "",
  },
  reducers: {
    setUserSlice: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      console.log("userSlice: ", user, accessToken, refreshToken)
      state.name = user.name;
      state.email = user.email;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    logout: (state) => {
      state.name = "";
      state.email = "";
      state.accessToken = "";
      state.refreshToken = "";
    },
  },
});

export const { setUserSlice, logout } = userSlice.actions;
export default userSlice.reducer;
