import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';
import produce from 'immer';

interface BundlesState {
  [key: string]: { loading: boolean; code: string; error: string } | undefined;
}

const initialState: BundlesState = {};

const reducer = produce(
  (state: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
      case ActionType.BUNDLE_START:
        // console.log('moving cell: ', action.payload);

        // const { direction } = action.payload;
        // const index = state.order.findIndex((id) => id === action.payload.id);
        // const targetIndex = direction === 'up' ? index - 1 : index + 1;
        // if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        //   return state;
        // }

        // state.order[index] = state.order[targetIndex];
        // state.order[targetIndex] = action.payload.id;
        state[action.payload.cellId] = {
          loading: true,
          code: '',
          error: '',
        };
        return state;

      case ActionType.BUNDLE_COMPLETE:
        state[action.payload.cellId] = {
          loading: false,
          code: action.payload.bundle.code,
          error: action.payload.bundle.err,
        };

        return state;

      default:
        return state;
    }
  }
);

export default reducer;
