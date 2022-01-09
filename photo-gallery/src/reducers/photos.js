import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";

const name = "photos"
const namespace = (method) => name+"/"+method;

const config = {
  headers: { Authorization: `Bearer ${localStorage.token}` }
};

const initialState=
{
    photos: null,
    score: 0
}

const getUserPhotos = createAsyncThunk(namespace('getUserPhotos'), async (payload) => {
    const { data } = await axios.get(`https://localhost:44369/api/photos/user:${payload}`)
    return data;
})
const addPhoto = createAsyncThunk(namespace('addPhoto'), async (payload) => {
  const { data } = await axios.post("https://localhost:44369/api/photos/post", payload, config)
  return data;
})
const getAllPhotos = createAsyncThunk(namespace('getAllPhotos'), async () => {
  const { data } = await axios.get(`https://localhost:44369/api/photos`)
  return data;
})
const ratePhoto = createAsyncThunk(namespace('ratePhoto'), async (payload) => {
  const { data } = await axios.post(`https://localhost:44369/api/photos/rate/${payload.id}/${payload.value}`, null, config)
  return data;
})
const getUserScore = createAsyncThunk(namespace('getUserScore'), async (payload) => {
  const { data } = await axios.get(`https://localhost:44369/api/photos/${payload}/score`, config)
  return data;
})
const deletePhoto = createAsyncThunk(namespace('deletePhoto'), async (payload) => {
  const { data } = await axios.delete(`https://localhost:44369/api/photos/remove/${payload}`, config)
  return data;
})
const photoSlice = createSlice({
  name: name,
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder
      .addCase(getUserPhotos.fulfilled, (state, {payload}) => {
        return {...state, photos: payload};
      })
      .addCase(addPhoto.fulfilled, (state) => {
        return {...state};
      })
      .addCase(getAllPhotos.fulfilled, (state, {payload}) => {
        return {...state, photos: payload};
      })
      .addCase(ratePhoto.fulfilled, (state) => {
        return {...state};
      })
      .addCase(deletePhoto.fulfilled, (state) => {
        return {...state};
      })
      .addCase(getUserScore.fulfilled, (state, {payload}) => {
        return {...state, score: payload};
      })
  }
})  

export {getUserPhotos, getAllPhotos, addPhoto, photoSlice, ratePhoto, deletePhoto, getUserScore }
