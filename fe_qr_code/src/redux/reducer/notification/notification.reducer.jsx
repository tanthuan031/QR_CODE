import { createSlice } from '@reduxjs/toolkit';

export const notificationsReducer = createSlice({
  name: 'notification',
  initialState: {
    dataNotificationClient: [],
    dataNotificationAdmin: [],
  },
  reducers: {
    setDataNotificationClient: (state, action) => {
      state.dataNotificationClient = action.payload;
    },
    setDataNotificationAdmin: (state, action) => {
      state.dataNotificationAdmin = action.payload;
    },
  },
});
export const { setDataNotificationClient, setDataNotificationAdmin } = notificationsReducer.actions;
export default notificationsReducer.reducer;
