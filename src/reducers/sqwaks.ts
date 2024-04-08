import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Squawk } from "../utils";
import { RootState } from "../configurestore";

const name = "squawks";

const initialState: Squawk[] = [];

const squawksSlice = createSlice({
  name,
  initialState,
  reducers: {
    addSquawk(state, action: PayloadAction<{ squawk: Squawk }>) {
      state.push(action.payload.squawk);
    },
    receiveSquawks(_, action: PayloadAction<{ squawks: Squawk[] }>) {
      return action.payload.squawks;
    },
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => state);
  },
});

export const { addSquawk, receiveSquawks } = squawksSlice.actions;

export const selectSquawks = (state: RootState) => state.squawks;

export const squawksReducer = squawksSlice.reducer;
