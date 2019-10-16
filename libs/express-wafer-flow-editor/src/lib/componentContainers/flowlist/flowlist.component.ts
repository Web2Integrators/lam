import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WaferflowListFacade } from '../../store/waferflow-list/waferflow-list.facade';
import { loadWaferflowList } from '../../store/waferflow-list/waferflow-list.actions';
import { WaferflowListEntity } from '../../store/waferflow-list/waferflow-list.models';

@Component({
  selector: 'ewfe-flowlist',
  templateUrl: './flowlist.component.html',
  styleUrls: ['./flowlist.component.scss']
})
export class FlowlistComponent implements OnInit {

  waferflowList$: Observable<WaferflowListEntity> = this.facade.waferflowlist$;
  constructor(private facade: WaferflowListFacade) { }

  ngOnInit() {
    this.facade.dispatch(loadWaferflowList())
  }

}
