import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const scheduleSlice = createSlice({
	name: 'schedule',
	initialState,
	reducers: {
		scheduleAdd(state, action) {
			state.push(action.payload);
		},
		scheduleRemove(state, action) {
			const id = action.payload;
			return state.filter((item) => item.scheduleId !== id);
		},
		scheduleUpdate(state, action) {
			const { id, title, text } = action.payload;
			const existingPost = state.find((post) => post.scheduleId === id);
			if (existingPost) {
				existingPost.scheduleTitle = title;
				existingPost.scheduleText = text;
			}
		},
	},
});

export const { scheduleAdd, scheduleRemove, scheduleUpdate } =
	scheduleSlice.actions;

export default scheduleSlice.reducer;
