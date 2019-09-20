import { ApplicationRef, Component, ComponentFactoryResolver, Injector, Type } from '@angular/core';
import { Column, IHeaderParams } from 'ag-grid-community';
import { IHeaderAngularComp } from 'ag-grid-angular';

import {
  AbstractCustomHeaderComponent,
  ICustomMenuComponent,
  IMenuContainer,
} from './abstract-custom-header.component';
import { LogService } from '../../../log/log.service';

/**
 * An interface for components that will build column menus for AgGridCustomHeaderComponent.
 */
export interface IColumnMenuComponent extends ICustomMenuComponent {
  column?: Column;
}

/**
 * An interface to extend IHeaderParams with types and callbacks needed for a column menu.
 */
export interface HeaderParams extends IHeaderParams, IMenuContainer<IColumnMenuComponent> {}

/**
 * Component to build a customer header for columns an ag-grid table.
 */
@Component({
  selector: 'column-custom-header',
  templateUrl: 'column-custom-header.component.html',
  styleUrls: ['column-custom-header.component.scss'],
})
export class ColumnCustomHeaderComponent extends AbstractCustomHeaderComponent<HeaderParams>
  implements IHeaderAngularComp {
  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    injector: Injector,
    applicationRef: ApplicationRef,
    logService: LogService,
  ) {
    super(componentFactoryResolver, injector, applicationRef, logService);
  }

  /**
   * Use a resolver to create and populate the component that will create the menu.
   *
   * This version overrides the parent implementation to add more menu component initialization.
   *
   * @param menu The type of the menu component
   * @param params The parameters used to initialize the component
   */
  resolveMenuComponent(menu: Type<IColumnMenuComponent>, params: HeaderParams) {
    const comp = super.resolveMenuComponent(menu, params);
    // set necessary state on the component
    comp.instance.column = params.column;

    return comp;
  }

  /**
   * Provide the column which was clicked so that ag-grid knows where to place it.
   */
  getClickedColumn(params: HeaderParams): Column {
    return params.column;
  }
}
