import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";

const name = "comments"
const namespace = (method) => name+"/"+method;

const config = {
    headers: { Authorization: `Bearer ${localStorage.token}` }
};
const initialState=
{
}
const addUserComment = createAsyncThunk(namespace('addUserComment'), async (payload) => {
    const { data } = await axios.post('https://localhost:44369/api/comments/post', payload, config)
    return data;
})
const deleteUserComment = createAsyncThunk(namespace('deleteUserComment'), async (payload) => {
  const { data } = await axios.delete(`https://localhost:44369/api/comments/remove/${payload}`, config)
  return data;
})
const commentSlice = createSlice({
  name: name,
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder
      .addCase(addUserComment.fulfilled, (state) => {
        return {...state};
      })
      .addCase(deleteUserComment.fulfilled, (state) => {
        return {...state};
      })
  }
})  

export {addUserComment, deleteUserComment, commentSlice}