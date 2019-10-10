import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { ExpresswfShellPartialState } from './expresswf-shell.reducer';
import * as ExpresswfShellActions from './expresswf-shell.actions';

@Injectable()
export class ExpresswfShellEffects {
  

  constructor(
    private actions$: Actions,

  ) {}
}
