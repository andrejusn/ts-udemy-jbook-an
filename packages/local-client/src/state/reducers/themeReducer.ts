import { ActionType } from '../action-types';
import { Action } from '../actions';
import produce from 'immer';

interface ThemeState {
  lightTheme: boolean;
}

const initialState: ThemeState = {
  lightTheme: false,
};

const reducer = produce(
  (state: ThemeState = initialState, action: Action): ThemeState => {
    switch (action.type) {
      case ActionType.TOGGLE_THEME:
        state.lightTheme = !state.lightTheme;
        return state;
      default:
        return state;
    }
  }
);

export default reducer;
