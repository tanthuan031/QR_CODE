import authReducer from './auth/auth.reducer';
import classroomReducer from './classroom/classroom.reducer';
import historyaskpermissionReducer from './history_ask_permistion/historyaskpermission.reducer';
import notificationsReducer from './notification/notification.reducer';

const { combineReducers } = require('@reduxjs/toolkit');

const rootReducer = new combineReducers({
  auth: authReducer,
  classroom: classroomReducer,
  historyask: historyaskpermissionReducer,
  notification: notificationsReducer,
});

export default rootReducer;
