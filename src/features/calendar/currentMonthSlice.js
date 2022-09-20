import { createSlice } from '@reduxjs/toolkit';
import { addMonths, subMonths } from 'date-fns';

const initialState = { value: new Date() };

export const currentMonthSlice = createSlice({
	name: 'currentMonth',
	initialState,
	reducers: {
		increase(state) {
			state.value = addMonths(state.value, 1);
		},
		decrease(state) {
			state.value = subMonths(state.value, 1);
		},
		setToday(state) {
			state.value = new Date();
		},
	},
});

export const { increase, decrease, setToday } = currentMonthSlice.actions;

export default currentMonthSlice.reducer;
