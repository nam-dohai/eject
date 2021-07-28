import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import matchReducer from './matchSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    match: matchReducer,
  }
})