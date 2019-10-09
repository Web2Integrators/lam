import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../store/reducers/';
import { loadExpressWaferFlows } from '../../store/actions/express-wafer-flow.actions';

@Component({
  selector: 'ewfe-flowlist',
  templateUrl: './flowlist.component.html',
  styleUrls: ['./flowlist.component.scss']
})
export class FlowlistComponent implements OnInit {

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.store.dispatch( loadExpressWaferFlows() )
  }

}
