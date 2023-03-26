import { createSlice } from '@reduxjs/toolkit';

export const classroomReducer = createSlice({
  name: 'classroom',
  initialState: {
    isDetail: false,
  },
  reducers: {
    setIsDetailClassroom: (state, action) => {
      state.isDetail = action.payload;
    },
  },
});
export const { setIsDetailClassroom } = classroomReducer.actions;
export default classroomReducer.reducer;
