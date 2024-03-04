import { createSlice } from "@reduxjs/toolkit";



export interface AuthState {
  isLoggin: boolean;
  data: object | null | any;
}

export const authSlice = createSlice({
  name: "userAuth",
  initialState: {
    isLoggin: false,
    data: null,
  } as AuthState,
  reducers: {
    authUser: (state, action) => {
      state.isLoggin = true;
      state.data = action.payload;
    },
    logout: (state) => {
      state.isLoggin = false;
      state.data = null;
    },
  },
});

export const { logout, authUser } = authSlice.actions;
export default authSlice.reducer;
