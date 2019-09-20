import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material';

import { DetailsDialogComponent, DetailsDialogComponentData } from './details-dialog.component';

describe('DetailsDialogComponent', () => {
  let cmp: DetailsDialogComponent;
  let data: DetailsDialogComponentData;

  beforeEach(() => {
    data = {
      title: 't',
      message: 'm',
      details: 'd',
      yesNo: true,
    };

    TestBed.configureTestingModule({
      providers: [
        DetailsDialogComponent,
        { provide: MAT_DIALOG_DATA, useValue: data }
      ],
    });

    cmp = TestBed.get(DetailsDialogComponent);
  });

  it('should be generated correctly', () => {
    expect(cmp.title).toBe('t');
    expect(cmp.message).toBe('m');
    expect(cmp.details).toBe('d');
    expect(cmp.yesNo).toBe(true);
  });

  describe('toggleDetails', () => {
    it('should toggle the value', () => {
      expect(cmp.expandDetails).toBe(false);

      cmp.toggleDetails();
      expect(cmp.expandDetails).toBe(true);

      cmp.toggleDetails();
      expect(cmp.expandDetails).toBe(false);
    });
  });
});
