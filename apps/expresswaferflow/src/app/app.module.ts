import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LamCommonEagerModule, routes } from '@lamresearch/lam-common-eager';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot([]
    ),
    // Must instrument after importing StoreModule
    //StoreDevtoolsModule.instrument({ maxAge: MAX_STORE_STATES }),
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    LamCommonEagerModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: 'envConfig',
      useValue: environment
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
