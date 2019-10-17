import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WaferflowListEntity } from '../../../store/waferflow-list/waferflow-list.models';
import { loadWaferflowList, selectCollection } from '../../../store/waferflow-list/waferflow-list.actions';
import { WaferflowListFacade } from '../../../store/waferflow-list/waferflow-list.facade';

@Component({
  selector: 'ewfe-waferflowlist',
  templateUrl: './waferflowlist.component.html',
  styleUrls: ['./waferflowlist.component.scss']
})
export class WaferflowlistComponent implements OnInit {

 // waferflowList$: Observable<WaferflowListEntity> = this.facade.waferflowlist$;
  collectionNames$: Observable<string[]> = this.facade.collectionNames$;
  waferFlowList$: Observable<string[]> = this.facade.waferFlowList$;
  constructor(private facade: WaferflowListFacade) {

    this.waferFlowList$.subscribe(data => {
      console.log(data);
    })
   }

  ngOnInit() {
    this.facade.dispatch(loadWaferflowList())
  }

  onCollectionNameChanged(collectionName)
  {
    console.log(collectionName);
    this.facade.dispatch(selectCollection({collectionName}))
  }


}
