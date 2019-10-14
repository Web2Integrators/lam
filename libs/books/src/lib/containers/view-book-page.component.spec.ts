import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';
import { MatCardModule } from '@angular/material';



import * as fromBooks from '../reducers';
import { ViewBookPageComponent } from './view-book-page.component';
import { SelectedBookPageComponent } from './selected-book-page.component';
import { BookDetailComponent } from '../components/book-detail.component';
import { BookAuthorsComponent } from '../components/book-authors.component';

import { ViewBookPageActions } from '../actions';
import { AddCommasPipe } from 'libs/utility/src/lib/pipes/add-commas.pipe';


describe('View Book Page', () => {
  let fixture: ComponentFixture<ViewBookPageComponent>;
  let store: MockStore<fromBooks.State>;
  let instance: ViewBookPageComponent;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: new BehaviorSubject({}) },
        },
        provideMockStore(),
      ],
      declarations: [
        ViewBookPageComponent,
        SelectedBookPageComponent,
        BookDetailComponent,
        BookAuthorsComponent,
        AddCommasPipe,
      ],
    });

    fixture = TestBed.createComponent(ViewBookPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);
    route = TestBed.get(ActivatedRoute);

    jest.spyOn(store, 'dispatch');
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a book.Select action on init', () => {
    const action = ViewBookPageActions.selectBook({ id: '2' });

    (route.params as BehaviorSubject<any>).next({ id: '2' });

    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });
});
