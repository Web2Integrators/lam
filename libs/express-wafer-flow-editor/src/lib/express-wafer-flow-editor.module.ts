import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { LayoutSidenavComponent } from './layoutContainers/layout-sidenav/layout-sidenav.component';
import { FlowlistComponent } from './componentContainers/flowlist/flowlist.component';
import { FlowlistviewComponent } from './components/flowlistview/flowlistview.component';

import { FlowListEffects } from './store/flowlist/flow-list.effects';
import { FlowListFacade } from './store/flowlist/flow-list.facade';
import { ExpresswfShellEffects } from './store/expresswf-shell/expresswf-shell.effects';
import { ExpresswfShellFacade } from './store/expresswf-shell/expresswf-shell.facade';
import { expressWafwerFlowFeaturekey, reducers } from './store';
import * as fromWaferflowList from './store/waferflow-list/waferflow-list.reducer';
import { WaferflowListEffects } from './store/waferflow-list/waferflow-list.effects';
import { WaferflowListFacade } from './store/waferflow-list/waferflow-list.facade';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: LayoutSidenavComponent }
    ]),
    StoreModule.forFeature(expressWafwerFlowFeaturekey, reducers),
    EffectsModule.forFeature([FlowListEffects, ExpresswfShellEffects]),
    StoreModule.forFeature(
      fromWaferflowList.WAFERFLOWLIST_FEATURE_KEY,
      fromWaferflowList.reducer
    ),
    EffectsModule.forFeature([WaferflowListEffects])
  ],
  declarations: [
    LayoutSidenavComponent,
    FlowlistComponent,
    FlowlistviewComponent
  ],
  providers: [
    ExpresswfShellEffects,
    FlowListEffects,
    FlowListFacade,
    ExpresswfShellFacade,
    WaferflowListFacade
  ]
})
export class ExpressWaferFlowEditorModule {}
