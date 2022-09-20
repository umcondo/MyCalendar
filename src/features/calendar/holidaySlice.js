import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const holidaySlice = createSlice({
	name: 'holiday',
	initialState,
	reducers: {
		holidayAdd(state, action) {
			return [...state, ...action.payload];
			// state.push(action.payload);
		},
	},
});

export const { holidayAdd } = holidaySlice.actions;

export default holidaySlice.reducer;
