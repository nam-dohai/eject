import { createSlice } from '@reduxjs/toolkit';
import { userDataTemplate } from '../constants';
const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: {
      ...userDataTemplate,
    },
  },
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload;
    },
    updateUserData: (state, action) => {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
  },
});

export const { setUserData, updateUserData } = userSlice.actions;
export default userSlice.reducer;
