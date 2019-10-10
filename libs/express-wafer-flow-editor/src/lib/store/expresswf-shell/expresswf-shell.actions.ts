import { createAction, props } from '@ngrx/store';
import { ExpresswfShellEntity } from './expresswf-shell.models';

export const loadExpresswfShell = createAction(
  '[ExpresswfShell] Load ExpresswfShell'
);

export const loadExpresswfShellSuccess = createAction(
  '[ExpresswfShell] Load ExpresswfShell Success',
  props<{ expresswfShell: ExpresswfShellEntity[] }>()
);

export const loadExpresswfShellFailure = createAction(
  '[ExpresswfShell] Load ExpresswfShell Failure',
  props<{ error: any }>()
);
