import { configureStore } from '@reduxjs/toolkit'
import { commentSlice } from '../reducers/comments'
import { photoSlice } from '../reducers/photos'
import { userSlice } from '../reducers/user'

export default configureStore({
  reducer: {
    user: userSlice.reducer,
    photos: photoSlice.reducer,
    comments: commentSlice.reducer
  },
  devTools: true
})