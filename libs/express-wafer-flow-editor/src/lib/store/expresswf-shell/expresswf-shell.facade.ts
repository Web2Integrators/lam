import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromExpresswfShell from './expresswf-shell.reducer';
import * as ExpresswfShellSelectors from './expresswf-shell.selectors';
import * as ExpresswfShellActions from './expresswf-shell.actions';

@Injectable()
export class ExpresswfShellFacade {
  loaded$ = this.store.pipe(
    select(ExpresswfShellSelectors.getExpresswfShellLoaded)
  );
  allExpresswfShell$ = this.store.pipe(
    select(ExpresswfShellSelectors.getAllExpresswfShell)
  );
  selectedExpresswfShell$ = this.store.pipe(
    select(ExpresswfShellSelectors.getSelected)
  );

  constructor(
    private store: Store<fromExpresswfShell.ExpresswfShellPartialState>
  ) {}

  loadAll() {
    this.store.dispatch(ExpresswfShellActions.loadExpresswfShell());
  }
}
