import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';
import produce from 'immer';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const cell1: Cell = {
  content: 'const firstVariable = "I\'m a string!!!";\nshow(firstVariable);',
  type: 'code',
  id: 'DEMO-CODE-1',
};
const cell2: Cell = {
  content:
    "I'm a text cell, you can write documentation in me.\n\n\n- If you hovered over a code cell below, the button will appear that allows to format and pretify your code!",
  type: 'text',
  id: 'DEMO-CODE-2',
};
const cell3: Cell = {
  content: `import 'bulmaswatch/superhero/bulmaswatch.min.css';
import React from 'react';
const FirstComponent = ({name}) => {
const [count, setCount] = React.useState(0)
return(<div>
 <h1 className="title">It's me, {name}!</h1>
 <h2 className="subtitle">Yes, and you are a {typeof name}</h2>
 <a className="button is-info is-rounded" onClick={()=> setCount(count + 1)}>I am clicked this many times: {count}</a>
 </div>);
}
  
  show(<FirstComponent name={firstVariable} />);`,
  type: 'code',
  id: 'DEMO-CODE-3',
};

const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }

        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;

        return state;

      case ActionType.DELETE_CELL:
        delete state.data[action.payload.id];
        state.order = state.order.filter((id) => id !== action.payload.id);
        return state;

      case ActionType.INSERT_CELL_AFTER:
        const cell: Cell = {
          content: '',
          type: action.payload.type,
          id: randomId(),
        };

        state.data[cell.id] = cell;

        const foundIndex = state.order.findIndex(
          (id) => id === action.payload.id
        );

        if (foundIndex < 0) {
          state.order.unshift(cell.id);
        } else {
          state.order.splice(foundIndex + 1, 0, cell.id);
        }

        return state;

      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        state.data[id].content = content;

        return state;

      case ActionType.FETCH_CELLS: {
        state.loading = true;
        state.error = null;
        return state;
      }

      case ActionType.FETCH_CELLS_COMPLETE: {
        state.loading = false;
        state.order = action.payload.map((cell) => cell.id);
        state.data = action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell;
          return acc;
        }, {} as CellsState['data']);

        return state;
      }

      case ActionType.FETCH_CELLS_ERROR: {
        state.loading = false;
        state.error = action.payload;
        return state;
      }

      case ActionType.SAVE_CELLS_ERROR: {
        state.error = action.payload;
        return state;
      }

      case ActionType.CREATE_DEMO_NOTES: {
        state.data[cell1.id] = cell1;
        state.data[cell2.id] = cell2;
        state.data[cell3.id] = cell3;

        state.order.unshift(cell3.id);
        state.order.unshift(cell2.id);
        state.order.unshift(cell1.id);

        return state;
      }

      case ActionType.REMOVE_DEMO_NOTES: {
        delete state.data[cell1.id];
        delete state.data[cell2.id];
        delete state.data[cell3.id];

        state.order = state.order.filter(
          (id) => id !== cell1.id && id !== cell2.id && id !== cell3.id
        );

        return state;
      }

      default:
        return state;
    }
  }
);

const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;
