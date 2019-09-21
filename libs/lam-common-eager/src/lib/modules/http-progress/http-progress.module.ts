import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpProgressService } from './http-progress.service';



@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpProgressService,
      multi: true,
    },
  ],
})
export class HttpProgressModule {}
