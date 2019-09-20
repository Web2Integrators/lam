import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { MessageDialogComponent } from './message-dialog.component';

describe('MessageDialogComponent', () => {
  let component: MessageDialogComponent;
  let fixture: ComponentFixture<MessageDialogComponent>;
  let messages: string[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [MessageDialogComponent],
    });
  });

  describe('with multiple messages', () => {
    beforeEach(() => {
      messages = ['123', '234'];
      TestBed.configureTestingModule({
        providers: [
          {
            provide: MAT_DIALOG_DATA,
            useValue: { title: 'foo', messages },
          },
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(MessageDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      // Component remains in the DOM unless we remove it (https://stackoverflow.com/a/43882257)
      document.body.removeChild(fixture.debugElement.nativeElement);
    });

    it('should be created with multiple values', () => {
      expect(component).toBeTruthy();

      const lis = fixture.debugElement.queryAll(By.css('li'));
      expect(lis.length).toBe(2);
      messages.forEach((msg, index) => {
        expect(lis[index].nativeElement.textContent).toBe(msg);
      });

      const header = fixture.debugElement.query(By.css('header'));
      expect(header.nativeElement.textContent).toBe('foo');

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.textContent).toBe('OK');
    });
  });

  describe('with single message', () => {
    beforeEach(() => {
      messages = ['123'];
      TestBed.configureTestingModule({
        providers: [
          {
            provide: MAT_DIALOG_DATA,
            useValue: { title: 'bar', messages, closeButtonLabel: 'Gotcha' },
          },
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(MessageDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      // Component remains in the DOM unless we remove it (https://stackoverflow.com/a/43882257)
      document.body.removeChild(fixture.debugElement.nativeElement);
    });

    it('should be created with multiple values', () => {
      expect(component).toBeTruthy();
      const lis = fixture.debugElement.queryAll(By.css('li'));
      expect(lis.length).toBe(0);

      const content = fixture.debugElement.query(By.css('mat-dialog-content'));
      expect(content.nativeElement.textContent).toBe(messages[0]);

      const header = fixture.debugElement.query(By.css('header'));
      expect(header.nativeElement.textContent).toBe('bar');

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.textContent).toBe('Gotcha');
    });
  });
});
