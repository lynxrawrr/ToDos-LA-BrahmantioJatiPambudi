import { createSlice } from "@reduxjs/toolkit";

const KEY = "todo_user";

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}
function saveUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}
function clearUser() {
  localStorage.removeItem(KEY);
}

const initialState = {
  user: loadUser(), 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // register user 
    register(state, action) {
      state.user = action.payload;
      saveUser(state.user);
    },
    // login user 
    login(state, action) {
      state.user = action.payload;
      saveUser(state.user);
    },
    // logout user
    logout(state) {
      state.user = null;
      clearUser();
    },
  },
});

export const { register, login, logout } = authSlice.actions;
export default authSlice.reducer;
