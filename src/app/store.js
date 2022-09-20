import { configureStore } from '@reduxjs/toolkit';
import currentMonthReducer from '../features/calendar/currentMonthSlice';
import selectedDateReducer from '../features/calendar/selectedDateSlice';
import selectedTodayReducer from '../features/calendar/selectedTodaySlice';
import scheduleSliceReducer from '../features/calendar/scheduleSlice';
import holidaySliceReducer from '../features/calendar/holidaySlice';

export const store = configureStore({
	reducer: {
		holidaySlice: holidaySliceReducer,
		currentMonth: currentMonthReducer,
		selectedDate: selectedDateReducer,
		selectedToday: selectedTodayReducer,
		scheduleSlice: scheduleSliceReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});
