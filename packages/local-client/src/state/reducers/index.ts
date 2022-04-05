import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';
import bundlesReducer from './bundlesReducer';
import themeReducer from './themeReducer';
import typecheckReducer from './typecheckReducer';

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
  typecheck: typecheckReducer,
  theme: themeReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
