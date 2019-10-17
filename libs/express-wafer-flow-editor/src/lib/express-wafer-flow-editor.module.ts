import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ExpresswfShellEffects } from './store/expresswf-shell/expresswf-shell.effects';
import { ExpresswfShellFacade } from './store/expresswf-shell/expresswf-shell.facade';
import { expressWafwerFlowFeaturekey, reducers } from './store';
import { WaferflowListEffects } from './store/waferflow-list/waferflow-list.effects';
import { WaferflowListFacade } from './store/waferflow-list/waferflow-list.facade';
import { LayoutSidenavComponent } from './containers/layoutContainers/layout-sidenav/layout-sidenav.component';
import { WaferflowlistComponent } from './containers/componentContainers/waferflowlist/waferflowlist.component';
import { WaferflowattributesComponent } from './containers/componentContainers/waferflowattributes/waferflowattributes.component';
import { WaferflowlistViewComponent } from './pure-components/waferflowlist-view/waferflowlist-view.component';
import { NodeattributesComponent } from './containers/componentContainers/nodeattributes/nodeattributes.component';
import { MaterialModule } from './shared';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: LayoutSidenavComponent }
    ]),
    StoreModule.forFeature(expressWafwerFlowFeaturekey, reducers),
    EffectsModule.forFeature([WaferflowListEffects,ExpresswfShellEffects])
  ],
  declarations: [
    LayoutSidenavComponent,
    WaferflowlistComponent,
    WaferflowattributesComponent,
    WaferflowlistViewComponent,
    NodeattributesComponent
  ],
  providers: [
    ExpresswfShellEffects,
    ExpresswfShellFacade,
    WaferflowListFacade
  ]
})
export class ExpressWaferFlowEditorModule {}
