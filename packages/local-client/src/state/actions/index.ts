import { ActionType } from '../action-types';
import { Cell, CellTypes, TypecheckData } from '../cell';

export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: Direction;
  };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: {
    id: string;
  };
}

export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: {
    id: string | null;
    type: CellTypes;
  };
}

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: string;
    content: string;
    tcheck?: TypecheckData[];
  };
}

export interface LoadCellsFromDiskAction {
  type: ActionType.FETCH_CELLS;
  payload: {
    id: string;
    content: string;
  };
}

export interface BundleStartAction {
  type: ActionType.BUNDLE_START;
  payload: {
    cellId: string;
  };
}

export interface BundleCompleteAction {
  type: ActionType.BUNDLE_COMPLETE;
  payload: {
    cellId: string;
    bundle: {
      code: string;
      err: string;
    };
  };
}

export interface FetchCellsAction {
  type: ActionType.FETCH_CELLS;
}

export interface FetchCellsCompleteAction {
  type: ActionType.FETCH_CELLS_COMPLETE;
  payload: Cell[];
}

export interface FetchCellsErrorAction {
  type: ActionType.FETCH_CELLS_ERROR;
  payload: string;
}

export interface SaveCellsErrorAction {
  type: ActionType.SAVE_CELLS_ERROR;
  payload: string;
}

export interface ToggleThemeAction {
  type: ActionType.TOGGLE_THEME;
}

export interface CreateDemoNotesAction {
  type: ActionType.CREATE_DEMO_NOTES;
}
export interface RemoveDemoNotesAction {
  type: ActionType.REMOVE_DEMO_NOTES;
}

export interface PersistCellErrorAction {
  type: ActionType.PERSIST_CELL_ERROR;
  payload: { id: string; errorMessage: string };
}

export interface TypecheckCodeErrorAction {
  type: ActionType.TYPECHECK_CODE_ERROR;
  payload: { id: string; errorMessage: string };
}

export type CellAction =
  | MoveCellAction
  | DeleteCellAction
  | InsertCellAfterAction
  | UpdateCellAction;

export type PersistCellAction =
  | CellAction
  | PersistCellErrorAction
  | TypecheckCodeErrorAction;

export type Action =
  | PersistCellAction
  | BundleStartAction
  | BundleCompleteAction
  | FetchCellsAction
  | FetchCellsCompleteAction
  | FetchCellsErrorAction
  | SaveCellsErrorAction
  | ToggleThemeAction
  | CreateDemoNotesAction
  | RemoveDemoNotesAction;

export type Direction = 'up' | 'down';
