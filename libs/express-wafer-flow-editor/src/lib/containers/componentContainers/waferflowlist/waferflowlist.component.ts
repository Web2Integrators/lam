import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WaferflowListEntity } from '../../../store/waferflow-list/waferflow-list.models';
import { loadWaferflowList } from '../../../store/waferflow-list/waferflow-list.actions';
import { WaferflowListFacade } from '../../../store/waferflow-list/waferflow-list.facade';

@Component({
  selector: 'ewfe-waferflowlist',
  templateUrl: './waferflowlist.component.html',
  styleUrls: ['./waferflowlist.component.scss']
})
export class WaferflowlistComponent implements OnInit {

  waferflowList$: Observable<WaferflowListEntity> = this.facade.waferflowlist$;
  constructor(private facade: WaferflowListFacade) { }

  ngOnInit() {
    this.facade.dispatch(loadWaferflowList())
  }


}
