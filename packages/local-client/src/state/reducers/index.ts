import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';
import bundlesReducer from './bundlesReducer';
import themeReducer from './themeReducer';

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
  theme: themeReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
