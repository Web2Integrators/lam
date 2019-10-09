import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowlistComponent } from './flowlist.component';
import { Store, StoreModule } from '@ngrx/store';

describe('FlowlistComponent', () => {
  let component: FlowlistComponent;
  let fixture: ComponentFixture<FlowlistComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ FlowlistComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowlistComponent);
    component = fixture.componentInstance;
    store = TestBed.get<Store<any>>(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
