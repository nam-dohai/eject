import { createSlice } from '@reduxjs/toolkit';
import { matchDataTemplate } from '../constants';

const matchSlice = createSlice({
  name: 'match',
  initialState: {
    data: {
      ...matchDataTemplate,
    },
  },
  reducers: {
    setMatchData: (state, action) => {
      state.data = action.payload;
    },
    updateMatchData: (state, action) => {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
  },
});

export const { setMatchData } = matchSlice.actions;
export default matchSlice.reducer;
