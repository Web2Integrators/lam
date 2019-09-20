import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Injector,
  OnDestroy,
  Type,
  ViewChild,
} from '@angular/core';
import {
  BodyScrollEvent,
  Column,
  ColumnApi,
  Context,
  EventService,
  GridApi,
  PopupService,
  Utils,
} from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Logger, LogService } from '../../../log/log.service';

/**
 * An interface for components that will build column menus.
 */
export interface ICustomMenuComponent {
  hidePopup?: Subject<void>; // a value emitted to this is used to trigger closing the window
  index?: number; // the 0-based index of this column/group in the grid
}

/**
 * An interface for the params passed by ag-grid into the AbstractCustomHeaderComponent.
 * Some fields need to be provided by the user, and some are provided by ag-grid.
 */
export interface IMenuContainer<T> {
  columnHeaderMenu: Type<T>; // The type of the component that is used build the menu.
  // callback for clicking outside the menu
  handleColumnClick: (event: MouseEvent, api: GridApi) => void;
  handleMenuClick: (api: GridApi) => void; // callback for clicking on the menu
  hideHeaderMenu?: boolean; // whether to hide the hamburger menu this time
  index?: number; // the 0-based index of this column/group in the grid
  // fields that are common between IHeaderGroupParams and IHeaderParams
  displayName: string;
  api: GridApi;
  columnApi: ColumnApi;
  context: any;
}

/**
 * Abstract class that can be used as the base for adding custom components with menus to
 * ag-grid headers.
 */
export abstract class AbstractCustomHeaderComponent<P extends IMenuContainer<any>>
  implements OnDestroy {
  @ViewChild('customHeaderMenuButton', { static: false })
  customHeaderMenuButton?: ElementRef<HTMLDivElement>;
  private hidePopup = new Subject<void>();
  private hidePopupFn?: () => void;
  private disposeFn?: () => void;
  private unsubscribe = new Subject<void>();
  params?: P;
  private readonly log: Logger;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly injector: Injector,
    private readonly applicationRef: ApplicationRef,
    logService: LogService,
  ) {
    this.log = logService.createLogger('AbstractCustomHeaderComponent');
  }

  /**
   * Clean up subscriptions and manually-created functions when destroyed.
   */
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    // When this component is destroyed, also destroy the menu component (won't happen otherwise)
    if (this.disposeFn) {
      this.disposeFn();
      this.disposeFn = undefined;
    }
  }

  /**
   * The hook that ag-grid provides after the grid is displayed to be able to
   * manage the params that were used.
   *
   * @param params headerComponentParams passed in for the column
   */
  agInit(params: P): void {
    this.params = params;
    this.hidePopup.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      if (this.hidePopupFn) {
        this.hidePopupFn();
        this.hidePopupFn = undefined;
      }
    });
  }

  /**
   * Handle the column being clicked
   *
   * @param event the DOM event
   */
  clickColumn(event: MouseEvent) {
    if (this.params) {
      this.params.handleColumnClick(event, this.params.api);
    }
  }

  /**
   * Handle when the menu hamburger is clicked. It creates a component of the type
   * specified by the params, initializes the properties of that component instance,
   * and shows the component in the DOM.
   */
  onMenuClick() {
    if (!this.params) {
      this.log.error('params not defined');
      return;
    }
    if (!this.customHeaderMenuButton) {
      this.log.error('customHeaderMenuButton not defined');
      return;
    }

    const eventSource = this.customHeaderMenuButton.nativeElement;
    // build the component that will be used for the header menu
    const comp = this.resolveMenuComponent(this.params.columnHeaderMenu, this.params);

    // add the component to the DOM
    this.hidePopupFn = this.showPositionedPopup(
      this.params.api,
      this.params.columnApi,
      this.getClickedColumn(this.params),
      comp,
      eventSource,
    );

    // Change column selection if the column clicked is outside the selected columns:
    this.params.handleMenuClick(this.params.api);
  }

  /**
   * Use a resolver to create and populate the component that will create the menu.
   *
   * @param menu The type of the menu component
   * @param params The parameters used to initialize the component
   */
  resolveMenuComponent<T extends ICustomMenuComponent>(menu: Type<T>, params: P) {
    // build the component that will be used for the header menu
    const cFactory = this.componentFactoryResolver.resolveComponentFactory(menu);
    const comp = cFactory.create(this.injector);
    // attach the component to the application so that Angular can operate on it
    this.applicationRef.attachView(comp.hostView);
    this.disposeFn = () => {
      this.applicationRef.detachView(comp.hostView);
      comp.destroy();
    };
    // set necessary state on the component
    comp.instance.index = params.index;
    comp.instance.hidePopup = this.hidePopup;

    return comp;
  }

  /**
   * Provide the column which was clicked so that ag-grid knows where to place it.
   */
  abstract getClickedColumn(params: P): Column;

  /**
   * Show the popup within the browser in the correct position.
   * Adapted from ag-grid https://git.io/fNkFV
   *
   * @param gridApi the ag-grid api for grid-specific information
   * @param columnApi the ag-grid api for column-specific information
   * @param column the column being clicked upon
   * @param comp the component wrapper for the new menu
   * @param eventSource the element that was clicked up
   */
  showPositionedPopup(
    gridApi: GridApi,
    columnApi: ColumnApi,
    column: Column,
    comp: ComponentRef<any>,
    eventSource: HTMLElement,
  ) {
    const primaryColumn = columnApi.getColumn(column);

    // context is private on GridApi, but this gives us access
    const context: Context = (gridApi as any).context;

    const popupService: PopupService = context.getBean('popupService');
    const eventService: EventService = context.getBean('eventService');

    return showPopup(popupService, eventService, primaryColumn, comp, eventSource);
  }
}

/**
 * Show the popup within the browser in the correct position.
 * Adapted from ag-grid https://git.io/fNkFV
 *
 * @param popupService the ag-grid service for popups
 * @param eventService the ag-grid service for events
 * @param column the column being clicked upon
 * @param comp the component wrapper for the new menu
 * @param eventSource the element that was clicked up
 */
export function showPopup(
  popupService: PopupService,
  eventService: EventService,
  column: Column,
  comp: ComponentRef<any>,
  eventSource: HTMLElement,
): () => void {
  const eMenu = document.createElement('div');
  Utils.addCssClass(eMenu, 'ag-menu');
  Utils.addCssClass(eMenu, 'pde-col-menu');
  eMenu.appendChild(comp.location.nativeElement);

  let hidePopup: () => void;

  const bodyScrollListener = (event: BodyScrollEvent) => {
    // if h scroll, popup is no longer over the column
    if (event.direction === 'horizontal') {
      hidePopup();
    }
  };
  const cellFocusedListener = () => {
    hidePopup();
  };

  eventService.addEventListener('bodyScroll', bodyScrollListener);
  eventService.addEventListener('cellFocused', cellFocusedListener);
  const closedCallback = () => {
    eventService.removeEventListener('bodyScroll', bodyScrollListener);
    eventService.removeEventListener('cellFocused', cellFocusedListener);
    column.setMenuVisible(false, 'contextMenu');
  };

  // need to show menu before positioning, as only after menu
  // is visible can we find out what the width of it is
  hidePopup = popupService.addAsModalPopup(eMenu, true, closedCallback);
  popupService.positionPopupUnderComponent({
    type: 'contextMenu',
    eventSource: eventSource,
    ePopup: eMenu,
    keepWithinBounds: true,
    column,
  });

  column.setMenuVisible(true, 'contextMenu');

  return hidePopup;
}
