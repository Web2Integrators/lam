import {
  ApplicationRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Injector,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Column,
  ColumnApi,
  EventService,
  GridApi,
  IHeaderParams,
  PopupService,
} from 'ag-grid-community';
import { Subject } from 'rxjs';

import { SpyObject } from '../../../../testing/spy-object.spec-util';
import {
  AbstractCustomHeaderComponent,
  ICustomMenuComponent,
  IMenuContainer,
  showPopup,
} from './abstract-custom-header.component';
import { LogService } from '../../../log/log.service';

interface HeaderParams extends IHeaderParams, IMenuContainer<ICustomMenuComponent> {}

@Component({
  template: '',
})
class TestMenuComponent implements ICustomMenuComponent {
  index?: number;
  hidePopup?: Subject<void>;
}

@Component({
  template: '',
})
class TestCustomHeaderComponent extends AbstractCustomHeaderComponent<HeaderParams> {
  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    injector: Injector,
    applicationRef: ApplicationRef,
    logService: LogService,
  ) {
    super(componentFactoryResolver, injector, applicationRef, logService);
  }

  getClickedColumn(params: HeaderParams): Column {
    return params.column;
  }
}

describe('AbstractCustomHeaderComponent', () => {
  let resolverSpy: jasmine.SpyObj<ComponentFactoryResolver>;
  let factorySpy: jasmine.SpyObj<ComponentFactory<any>>;

  describe('method', () => {
    let cmp: TestCustomHeaderComponent;
    resolverSpy = jasmine.createSpyObj<ComponentFactoryResolver>('resolver', [
      'resolveComponentFactory',
    ]);
    factorySpy = jasmine.createSpyObj<ComponentFactory<any>>('factory', ['create']);
    resolverSpy.resolveComponentFactory.and.returnValue(factorySpy);
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          TestCustomHeaderComponent,
          TestMenuComponent,
          { provide: ComponentFactoryResolver, useValue: resolverSpy },
        ],
      });

      cmp = TestBed.get(TestCustomHeaderComponent);
    });

    describe('onMenuClick', () => {
      let componentRefSpy: jasmine.SpyObj<any>;
      let appRef: ApplicationRef;

      beforeEach(() => {
        componentRefSpy = jasmine.createSpyObj(['']);
        factorySpy.create.and.returnValue(componentRefSpy);
        componentRefSpy.hostView = jasmine.createSpyObj(['attachToAppRef']);
        componentRefSpy.instance = {};

        cmp.customHeaderMenuButton = jasmine.createSpyObj('elementRef', ['']);
        cmp.customHeaderMenuButton!.nativeElement = SpyObject.create(HTMLDivElement);
        cmp.params = {
          columnHeaderMenu: TestMenuComponent,
          column: { getColDef: () => ({}) },
          columnApi: SpyObject.create(ColumnApi) as ColumnApi,
          handleMenuClick: () => {},
          api: SpyObject.create(GridApi) as GridApi,
          index: 7,
        } as any;
        spyOn(cmp, 'showPositionedPopup').and.returnValue(() => {});
        appRef = TestBed.get(ApplicationRef);
        spyOn(appRef, 'attachView').and.callThrough();
      });

      it('should handle the happy case', () => {
        if (!cmp.params) {
          fail('Should have the params set up');
          return;
        }
        if (!cmp.customHeaderMenuButton) {
          fail('Should have the customHeaderMenuButton set up');
          return;
        }
        cmp.onMenuClick();

        expect(cmp.showPositionedPopup).toHaveBeenCalledWith(
          cmp.params.api,
          cmp.params.columnApi,
          cmp.params.column,
          componentRefSpy,
          cmp.customHeaderMenuButton.nativeElement,
        );
        expect(componentRefSpy.instance.index).toBe(cmp.params.index);
        expect(resolverSpy.resolveComponentFactory).toHaveBeenCalledWith(TestMenuComponent);
        expect(appRef.attachView).toHaveBeenCalledWith(componentRefSpy.hostView);
      });
    });
  });

  describe('function', () => {
    describe('showPopup', () => {
      let popupService: jasmine.SpyObj<PopupService>;
      let eventService: jasmine.SpyObj<EventService>;
      let column: jasmine.SpyObj<Column>;
      let componentRefSpy: jasmine.SpyObj<any>;
      let eventSource: jasmine.SpyObj<HTMLElement>;

      beforeEach(() => {
        popupService = SpyObject.create(PopupService);
        eventService = SpyObject.create(EventService);
        column = SpyObject.create(Column);
        componentRefSpy = jasmine.createSpyObj(['']);
        eventSource = SpyObject.create(HTMLElement);
        componentRefSpy.location = { nativeElement: document.createElement('div') };
      });

      it('should handle the happy case', () => {
        showPopup(popupService, eventService, column, componentRefSpy, eventSource);

        expect(popupService.addAsModalPopup).toHaveBeenCalledWith(
          jasmine.any(HTMLElement),
          true,
          jasmine.any(Function),
        );
        const eMenu: HTMLDivElement = popupService.addAsModalPopup.calls.mostRecent().args[0];
        expect(eMenu.className).toContain('ag-menu');
        expect(eMenu.className).toContain('pde-col-menu');
        expect(eMenu.childElementCount).toBe(1);
        expect(eMenu.firstChild).toBe(componentRefSpy.location.nativeElement);
        expect(popupService.positionPopupUnderComponent).toHaveBeenCalledTimes(1);
        expect(eventService.addEventListener).toHaveBeenCalledWith(
          'bodyScroll',
          jasmine.any(Function),
        );
        expect(column.setMenuVisible).toHaveBeenCalledWith(true, 'contextMenu');
      });
    });
  });
});
