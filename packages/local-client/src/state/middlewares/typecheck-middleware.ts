import { Dispatch } from 'redux';
import { Action, UpdateCellAction } from '../actions';
import { typecheckCode } from '../action-creators';
import { RootState } from '../reducers';
import { ActionType } from '../action-types';

export const typecheckMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  let timer: NodeJS.Timeout;
  return (next: (action: UpdateCellAction) => void) => {
    return (action: UpdateCellAction) => {
      console.log(action);

      if (action.type === ActionType.UPDATE_CELL) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          typecheckCode(action.payload.id, action.payload.content)(
            dispatch,
            getState
          );
          console.log(action.payload);
        }, 1000);
      }
      next(action);
    };
  };
};
