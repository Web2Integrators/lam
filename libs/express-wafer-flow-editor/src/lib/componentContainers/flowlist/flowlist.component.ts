import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';
import { loadFlowList } from '../../store/flowlist/flow-list.actions';
import { State } from '../../store';
import { FlowListFacade } from '../../store/flowlist/flow-list.facade';

@Component({
  selector: 'ewfe-flowlist',
  templateUrl: './flowlist.component.html',
  styleUrls: ['./flowlist.component.scss']
})
export class FlowlistComponent implements OnInit {

  flowList$: Observable<any> = this.facade.flowlist$;
  constructor(private facade: FlowListFacade) { }

  ngOnInit() {
   // this.store.dispatch(loadFlowList());
    //this.flowList$ = this.store.pipe(select(getExpress));
  }

}
