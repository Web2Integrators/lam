import { ApplicationRef, Component, ComponentFactoryResolver, Injector } from '@angular/core';
import { Column, IHeaderGroupParams } from 'ag-grid-community';
import { IHeaderGroupAngularComp } from 'ag-grid-angular';

import {
  AbstractCustomHeaderComponent,
  ICustomMenuComponent,
  IMenuContainer,
} from './abstract-custom-header.component';
import { LogService } from '../../../log/log.service';

/**
 * An interface to extend IHeaderGroupParams with types and callbacks needed for a column menu.
 */
export interface HeaderParams extends IHeaderGroupParams, IMenuContainer<ICustomMenuComponent> {}

/**
 * Component to build a custom header for column groups in an ag-grid table.
 */
@Component({
  selector: 'column-group-custom-header',
  templateUrl: './column-group-custom-header.component.html',
  styleUrls: ['column-group-custom-header.component.scss'],
})
export class ColumnGroupCustomHeaderComponent extends AbstractCustomHeaderComponent<HeaderParams>
  implements IHeaderGroupAngularComp {
  isExpanded = false;

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    injector: Injector,
    applicationRef: ApplicationRef,
    logService: LogService,
  ) {
    super(componentFactoryResolver, injector, applicationRef, logService);
  }

  /**
   * The hook for ag-grid provides after the grid is displayed to be able to
   * manage the params that were used.
   *
   * @param params headerComponentParams passed in for the column
   */
  agInit(params: HeaderParams): void {
    super.agInit(params);
    this.isExpanded = params.columnGroup.isExpanded();
  }

  /**
   * Toggle the expanded/collapsed state of the group.
   */
  toggleExpanded() {
    if (this.params) {
      this.params.setExpanded(!this.isExpanded);
    }
  }

  /**
   * Provide the column which was clicked so that ag-grid knows where to place it.
   */
  getClickedColumn(params: HeaderParams): Column {
    return params.columnGroup.getDisplayedLeafColumns()[0];
  }
}
