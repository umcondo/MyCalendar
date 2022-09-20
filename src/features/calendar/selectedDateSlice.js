import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: '' };

export const selectedDateSlice = createSlice({
	name: 'selectedDate',
	initialState,
	reducers: {
		setCurrentDate(state, action) {
			state.value = action.payload;
		},
	},
});

export const { setCurrentDate } = selectedDateSlice.actions;

export default selectedDateSlice.reducer;
