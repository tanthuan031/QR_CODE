import { createSlice } from '@reduxjs/toolkit';

export const classroomReducer = createSlice({
  name: 'classroom',
  initialState: {
    isDetail: false,
    isQR: false,
    dataDetail: {},
  },
  reducers: {
    setIsDetailClassroom: (state, action) => {
      state.isDetail = action.payload;
    },
    setDataDetailClassroom: (state, action) => {
      state.dataDetail = action.payload;
    },
    setIsQR: (state, action) => {
      state.isQR = action.payload;
    },
  },
});
export const { setIsDetailClassroom, setDataDetailClassroom, setIsQR } = classroomReducer.actions;
export default classroomReducer.reducer;
