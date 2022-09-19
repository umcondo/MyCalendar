import { combineReducers } from "redux";
import counter2 from "./counter2";
import todos from "./todos";

const rootReducer2 = combineReducers({
  counter2,
  todos,
});

export default rootReducer2;
