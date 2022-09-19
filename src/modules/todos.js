// 액션
const ADD_TODOS = "todos/ADD_TODOS";
const TOGGLE_TODOS = "todos/TOGGLE_TODOS";

// 액션 생성함수
let nextId = 1;
export const addTodo = (text) => ({
  type: ADD_TODOS,
  todo: {
    id: nextId++,
    text,
  },
});

export const toggleTodos = (id) => ({
  type: TOGGLE_TODOS,
  id,
});

// 초기상태
const initialState = [];

// 리듀서
export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODOS:
      return [...state, action.todo];
    case TOGGLE_TODOS:
      return state.map((elm) =>
        elm.id === action.id ? { ...elm, done: !elm.done } : elm
      );
    default:
      return state;
  }
}
