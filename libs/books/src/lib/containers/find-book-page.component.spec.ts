import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import {
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';


import * as fromBooks from '../reducers';
import { FindBookPageComponent } from '.';
import { BookSearchComponent, BookPreviewComponent, BookPreviewListComponent, BookAuthorsComponent } from '../components';
import { AddCommasPipe } from 'libs/utility/src/lib/pipes/add-commas.pipe';
import { EllipsisPipe } from 'libs/utility/src/lib/pipes/ellipsis.pipe';
import { FindBookPageActions } from '../actions';


describe('Find Book Page', () => {
  let fixture: ComponentFixture<FindBookPageComponent>;
  let store: MockStore<fromBooks.State>;
  let instance: FindBookPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        MatInputModule,
        MatCardModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
      ],
      declarations: [
        FindBookPageComponent,
        BookSearchComponent,
        BookPreviewComponent,
        BookPreviewListComponent,
        BookAuthorsComponent,
        AddCommasPipe,
        EllipsisPipe,
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: fromBooks.selectSearchQuery, value: '' },
            { selector: fromBooks.selectSearchResults, value: [] },
            { selector: fromBooks.selectSearchLoading, value: false },
            { selector: fromBooks.selectSearchError, value: '' },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(FindBookPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch');
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a book.Search action on search', () => {
    const $event = 'book name';
    const action = FindBookPageActions.searchBooks({ query: $event });

    instance.search($event);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
