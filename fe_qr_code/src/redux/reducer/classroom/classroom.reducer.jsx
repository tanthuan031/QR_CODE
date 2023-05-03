import { createSlice } from '@reduxjs/toolkit';

export const classroomReducer = createSlice({
  name: 'classroom',
  initialState: {
    isDetail: false,
    isQR: false,
    dataDetail: {},
    dataCreateQR: {},
    // Client
    isDetailClient: false,
    dataDetailClient: undefined,
    isScanQR: false,
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
    setDataCreateQRCode: (state, action) => {
      state.dataCreateQR = action.payload;
    },

    // Client
    setIsDetailClassroomClient: (state, action) => {
      state.isDetailClient = action.payload;
    },
    setDataDetailClassroomClient: (state, action) => {
      state.dataDetailClient = action.payload;
    },
    setIsScanQR: (state, action) => {
      state.isScanQR = action.payload;
    },
  },
});
export const {
  setIsDetailClassroom,
  setDataDetailClassroom,
  setIsQR,
  setDataCreateQRCode,
  setIsDetailClassroomClient,
  setDataDetailClassroomClient,
  setIsScanQR,
} = classroomReducer.actions;
export default classroomReducer.reducer;
