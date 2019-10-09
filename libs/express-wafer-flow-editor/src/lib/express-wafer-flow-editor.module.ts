import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutSidenavComponent } from './layoutContainers/layout-sidenav/layout-sidenav.component';
import { StoreModule } from '@ngrx/store';
import * as fromExpressWaferFlow from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { ExpressWaferFlowEffects } from './store/effects/express-wafer-flow.effects';
import { FlowlistComponent } from './componentContainers/flowlist/flowlist.component';

import { FlowlistviewComponent } from './components/flowlistview/flowlistview.component';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: LayoutSidenavComponent }
    ]),

    StoreModule.forFeature(fromExpressWaferFlow.expressWafwerFlowFeaturekey,fromExpressWaferFlow.reducers),
    EffectsModule.forFeature([ExpressWaferFlowEffects]),

  ],
  declarations: [LayoutSidenavComponent, FlowlistComponent, FlowlistviewComponent],
  providers:[ExpressWaferFlowEffects]
})
export class ExpressWaferFlowEditorModule {}
