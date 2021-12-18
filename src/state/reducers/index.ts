import { combineReducers } from "redux";

import cellsReducer from "../reducers/cellsReducer";
import bundlesReducer from "../reducers/bundlesReducer";

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
