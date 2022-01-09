import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";

const name = "user"
const namespace = (method) => name+"/"+method;

const config = {
  headers: { Authorization: `Bearer ${localStorage.token}` }
};

const initialState=
{
    userData: null,
    userProfile: null,
    isLoggedIn: false,
    role: null,
    searchedUser: null,
}
const login = createAsyncThunk(namespace('login'), async (payload) => {
    const { data } = await axios.post('https://localhost:44369/api/auth/login', payload)
    localStorage.setItem('token', data.accessToken);
    return data;
})
const register = createAsyncThunk(namespace('register'), async (payload) => {
    const { data } = await axios.post('https://localhost:44369/api/auth/register', payload)
    return data;
})
const checkLogin = createAsyncThunk(namespace('checklogin'), async (payload) => {
    const { data } = await axios.post('https://localhost:44369/api/auth/check-login', {token: localStorage.getItem('token')});
    return data;
})
const getUser = createAsyncThunk(namespace('getuser'), async (payload) => {
  const { data } = await axios.get(`https://localhost:44369/api/users/${payload}`);
  return data;
})
const updateUser = createAsyncThunk(namespace('updateUser'), async (payload) => {
  const { data } = await axios.put(`https://localhost:44369/api/users/update/${payload.username}`, {imageUrl: payload.imageUrl, name: payload.name, title: payload.title, description: payload.description}, config);
  return data;
})
const searchUser = createAsyncThunk(namespace('searchUser'), async (payload) => {
  const { data } = await axios.get(`https://localhost:44369/api/users/search?pattern=${payload.pattern}`, config);
  return data;
})
const userSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    logout: (state) =>{
      localStorage.removeItem('token');
      return {...initialState}
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state, {payload: {accessToken}}) => {
        return {...state, isLoggedIn: true};
      })
      .addCase(register.fulfilled, (state, {payload: {accessToken}}) => {
        return {...state};
      })
      .addCase(checkLogin.fulfilled, (state, payload) => {
        return {...state, userData: payload.payload.user, role: payload.payload.role, isLoggedIn: true};
      })
      .addCase(getUser.fulfilled, (state, payload) => {
        return {...state, userProfile: payload.payload};
      })
      .addCase(updateUser.fulfilled, (state) => {
        return {...state};
      })
      .addCase(searchUser.fulfilled, (state, payload) => {
        return {...state, searchedUser: payload.payload};
      })
  }
})  

export {login, register, checkLogin, userSlice, getUser, updateUser}
export const { logout } = userSlice.actions
