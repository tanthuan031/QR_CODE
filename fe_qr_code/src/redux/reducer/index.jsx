import classroomReducer from './classroom/classroom.reducer';

const { combineReducers } = require('@reduxjs/toolkit');

const rootReducer = new combineReducers({
  classroom: classroomReducer,
});

export default rootReducer;
