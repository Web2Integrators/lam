import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State, getExpress } from '../../store/reducers/';
import { loadExpressWaferFlows } from '../../store/actions/express-wafer-flow.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'ewfe-flowlist',
  templateUrl: './flowlist.component.html',
  styleUrls: ['./flowlist.component.scss']
})
export class FlowlistComponent implements OnInit {

  flowList$: Observable<any>;
  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.store.dispatch(loadExpressWaferFlows());
    this.flowList$ = this.store.pipe(select(getExpress));
  }

}
