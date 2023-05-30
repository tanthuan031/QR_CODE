import { createSlice } from '@reduxjs/toolkit';

export const historyAskPermissionReducer = createSlice({
  name: 'historyask',
  initialState: {
    isDetail: {
      isDetail: false,
      classroom: {},
    },
    dataDetail: [],
  },
  reducers: {
    setIsDetailHistoryAskPermission: (state, action) => {
      state.isDetail = action.payload;
    },
    setDataDetailHistoryAskPermission: (state, action) => {
      state.dataDetail = action.payload;
    },
  },
});
export const { setIsDetailHistoryAskPermission, setDataDetailHistoryAskPermission } =
  historyAskPermissionReducer.actions;
export default historyAskPermissionReducer.reducer;
