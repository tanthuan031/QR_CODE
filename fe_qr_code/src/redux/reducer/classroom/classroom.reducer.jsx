import { createSlice } from '@reduxjs/toolkit';

export const classroomReducer = createSlice({
  name: 'classroom',
  initialState: {
    isDetail: false,
    isQR: false,
  },
  reducers: {
    setIsDetailClassroom: (state, action) => {
      state.isDetail = action.payload;
    },
    setIsQR: (state, action) => {
      state.isQR = action.payload;
    },
  },
});
export const { setIsDetailClassroom, setIsQR } = classroomReducer.actions;
export default classroomReducer.reducer;
