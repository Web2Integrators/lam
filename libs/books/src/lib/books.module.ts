import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BookAuthorsComponent, BookDetailComponent, BookPreviewComponent } from './components';
import { BookPreviewListComponent } from './components/book-preview-list.component';
import { BookSearchComponent } from './components/book-search.component';
import { FindBookPageComponent } from './containers/find-book-page.component';
import { ViewBookPageComponent, CollectionPageComponent, SelectedBookPageComponent } from './containers';
import { MaterialModule, PipesModule } from '@lamresearch/utility';
import { BooksRoutingModule } from './books-routing.module';
import * as fromBooks from './reducers';
import { BookEffects, CollectionEffects } from './effects';




export const COMPONENTS = [
  BookAuthorsComponent,
  BookDetailComponent,
  BookPreviewComponent,
  BookPreviewListComponent,
  BookSearchComponent,
];

export const CONTAINERS = [
  FindBookPageComponent,
  ViewBookPageComponent,
  SelectedBookPageComponent,
  CollectionPageComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    BooksRoutingModule,

    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
     */
    StoreModule.forFeature(fromBooks.booksFeatureKey, fromBooks.reducers),

    /**
     * Effects.forFeature is used to register effects
     * from feature modules. Effects can be loaded
     * eagerly or lazily and will be started immediately.
     *
     * All Effects will only be instantiated once regardless of
     * whether they are registered once or multiple times.
     */
    EffectsModule.forFeature([BookEffects, CollectionEffects]),
    PipesModule,

  ],
  declarations: [COMPONENTS, CONTAINERS],
})
export class BooksModule {}
