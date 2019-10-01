
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';



import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DetailsDialogComponent } from './details-dialog/details-dialog.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { ModalService } from './modal.service';
import { SelectionDialogComponent } from './selection-dialog/selection-dialog.component';
import { SpyObject } from '@lamresearch/utility';

describe('ModalService', () => {
  let svc: ModalService;
  //todo:removed type
  let modal: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalService, { provide: MatDialog, useValue: new SpyObject(MatDialog) }],
    });

    svc = TestBed.get(ModalService);
    modal = TestBed.get(MatDialog);
  });

  describe('select', () => {
    it('should handle making a selection', async () => {
      const ref: any = {
        componentInstance: {} as any,
        afterClosed: () => of('foo'),
      };
      modal.open.and.returnValue(ref);

      const result = await svc.select(['foo', 'bar'], 'bar', 'title').toPromise();

      expect(result).toBe('foo');
      expect(modal.open).toHaveBeenCalledTimes(1);
      expect(modal.open).toHaveBeenCalledWith(SelectionDialogComponent, {
        hasBackdrop: true,
        disableClose: true,
        data: {
          title: 'title',
          options: ['foo', 'bar'],
          value: 'bar',
        },
        minWidth: undefined,
      });
    });

    it('should handle making a selection w/ SelectOptions', async () => {
      const options = [{ display: 'FOO', value: 'foo' }, { display: 'BAR', value: 'bar' }];
      const ref: any = {
        componentInstance: {} as any,
        afterClosed: () => of('foo'),
      };
      modal.open.and.returnValue(ref);

      const result = await svc.select(options, 'bar', 'title').toPromise();

      expect(result).toBe('foo');
      expect(modal.open).toHaveBeenCalledTimes(1);
      expect(modal.open).toHaveBeenCalledWith(SelectionDialogComponent, {
        hasBackdrop: true,
        disableClose: true,
        data: {
          title: 'title',
          options,
          value: 'bar',
        },
        minWidth: undefined,
      });
    });

    // it('should handle making a selection w/ SelectOptions<RecipeIdentifier>', async () => {
    //   const options = [
    //     { display: 'FOO', value: { recipeName: 'foo', recipeType: RecipeType.process } },
    //     { display: 'BAR', value: { recipeName: 'bar', recipeType: RecipeType.process } },
    //   ];

    //   const ref: any = {
    //     componentInstance: {} as any,
    //     afterClosed: () => of(options[0].value),
    //   };
    //   modal.open.and.returnValue(ref);

    //   const result = await svc.select(options, options[1].value, 'title').toPromise();

    //   expect(result).toEqual(options[0].value);
    //   expect(modal.open).toHaveBeenCalledTimes(1);
    //   expect(modal.open).toHaveBeenCalledWith(SelectionDialogComponent, {
    //     hasBackdrop: true,
    //     disableClose: true,
    //     data: {
    //       title: 'title',
    //       options,
    //       value: options[1].value,
    //     },
    //     minWidth: undefined,
    //   });
    // });

    it('should handle clicking cancel', async () => {
      const ref: any = {
        componentInstance: {} as any,
        afterClosed: () => of(undefined),
      };
      modal.open.and.returnValue(ref);

      const result = await svc.select(['foo', 'bar'], 'bar', 'title').toPromise();

      // The observable should not have emitted anything before completing due to the filter:
      expect(result).toBeUndefined();
      expect(modal.open).toHaveBeenCalledTimes(1);
      expect(modal.open).toHaveBeenCalledWith(SelectionDialogComponent, {
        hasBackdrop: true,
        disableClose: true,
        data: {
          title: 'title',
          options: ['foo', 'bar'],
          value: 'bar',
        },
        minWidth: undefined,
      });
    });
  });

  describe('confirm', () => {
    it('should handle clicking OK', async () => {
      const ref: any = {
        componentInstance: {} as any,
        afterClosed: () => of(true),
      };
      modal.open.and.returnValue(ref);

      const result = await svc.confirm().toPromise();

      expect(result).toBe(true);
      expect(modal.open).toHaveBeenCalledTimes(1);
      expect(modal.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
        hasBackdrop: true,
        disableClose: true,
        data: {
          title: 'Confirm',
          message: 'Are you sure?',
          confirmingLabel: 'OK',
          dismissiveLabel: 'Cancel',
        },
        minWidth: undefined,
      });
    });

    it('should handle clicking cancel', async () => {
      const ref: any = {
        componentInstance: {} as any,
        afterClosed: () => of(undefined),
      };
      modal.open.and.returnValue(ref);

      const result = await svc.confirm('msg', 't', 'Yep', 'Nope').toPromise();

      expect(result).toBeUndefined();
      expect(modal.open).toHaveBeenCalledTimes(1);
      expect(modal.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
        hasBackdrop: true,
        disableClose: true,
        data: {
          title: 't',
          message: 'msg',
          confirmingLabel: 'Yep',
          dismissiveLabel: 'Nope',
        },
        minWidth: undefined,
      });
    });
  });

  describe('message', () => {
    it('should handle clicking OK', async () => {
      const ref: any = {
        componentInstance: {} as any,
        afterClosed: () => of(true),
      };
      modal.open.and.returnValue(ref);

      const result = await svc.message('msg').toPromise();

      expect(result).toBe(true);
      expect(modal.open).toHaveBeenCalledTimes(1);
      expect(modal.open).toHaveBeenCalledWith(MessageDialogComponent, {
        hasBackdrop: true,
        disableClose: true,
        data: {
          title: 'Message',
          messages: ['msg'],
          closeButtonLabel: 'OK',
        },
        minWidth: undefined,
      });
    });

    it('should handle clicking cancel', async () => {
      const ref: any = {
        componentInstance: {} as any,
        afterClosed: () => of(undefined),
      };
      modal.open.and.returnValue(ref);

      const result = await svc.message(['msg', 'msg2'], 'title', 'Dismiss').toPromise();

      expect(result).toBeUndefined();
      expect(modal.open).toHaveBeenCalledTimes(1);
      expect(modal.open).toHaveBeenCalledWith(MessageDialogComponent, {
        hasBackdrop: true,
        disableClose: true,
        data: {
          title: 'title',
          messages: ['msg', 'msg2'],
          closeButtonLabel: 'Dismiss',
        },
        minWidth: undefined,
      });
    });
  });

  describe('details', () => {
    it('should handle clicking OK', async () => {
      const ref: any = {
        componentInstance: {} as any,
        afterClosed: () => of(true),
      };
      modal.open.and.returnValue(ref);

      const result = await svc.details('msg').toPromise();

      expect(result).toBe(true);
      expect(modal.open).toHaveBeenCalledTimes(1);
      expect(modal.open).toHaveBeenCalledWith(DetailsDialogComponent, {
        hasBackdrop: true,
        disableClose: true,
        data: {
          title: 'Message',
          message: 'msg',
          details: undefined,
          yesNo: false,
        },
        minWidth: undefined,
      });
    });

    it('should handle clicking cancel', async () => {
      const ref: any = {
        componentInstance: {} as any,
        afterClosed: () => of(undefined),
      };
      modal.open.and.returnValue(ref);

      const result = await svc.details('msg', { details: {} }, 't', true).toPromise();

      expect(result).toBeUndefined();
      expect(modal.open).toHaveBeenCalledTimes(1);
      expect(modal.open).toHaveBeenCalledWith(DetailsDialogComponent, {
        hasBackdrop: true,
        disableClose: true,
        data: {
          title: 't',
          message: 'msg',
          details: { details: {} },
          yesNo: true,
        },
        minWidth: undefined,
      });
    });
  });

  describe('custom', () => {
    class CustomComponent {}

    it('should handle clicking OK', async () => {
      const ref: any = {
        componentInstance: {} as any,
        afterClosed: () => of(true),
      };
      modal.open.and.returnValue(ref);

      const result = await svc.custom(CustomComponent).toPromise();

      expect(result).toBe(true);
      expect(modal.open).toHaveBeenCalledTimes(1);
      expect(modal.open).toHaveBeenCalledWith(CustomComponent, {
        hasBackdrop: true,
        disableClose: true,
        data: undefined,
        minWidth: undefined,
      });
    });

    it('should handle clicking cancel', async () => {
      const ref: any = {
        componentInstance: {} as any,
        afterClosed: () => of(undefined),
      };
      modal.open.and.returnValue(ref);

      const result = await svc.custom(CustomComponent, { prop2: 7 }, 'a').toPromise();

      expect(result).toBeUndefined();
      expect(modal.open).toHaveBeenCalledTimes(1);
      expect(modal.open).toHaveBeenCalledWith(CustomComponent, {
        hasBackdrop: true,
        disableClose: true,
        data: { prop2: 7 },
        minWidth: 'a',
      });
    });
  });
});
