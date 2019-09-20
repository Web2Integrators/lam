import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { HttpLoggingService } from './http-logging.service';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoggingService,
      multi: true,
    },
  ],
})
export class HttpLoggingModule {}
