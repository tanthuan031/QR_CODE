import authReducer from './auth/auth.reducer';
import classroomReducer from './classroom/classroom.reducer';

const { combineReducers } = require('@reduxjs/toolkit');

const rootReducer = new combineReducers({
  auth: authReducer,
  classroom: classroomReducer,
});

export default rootReducer;
