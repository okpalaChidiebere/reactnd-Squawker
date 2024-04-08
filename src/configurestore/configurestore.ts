import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { squawksReducer } from "../reducers";

const rootReducer = combineReducers({
  squawks: squawksReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
