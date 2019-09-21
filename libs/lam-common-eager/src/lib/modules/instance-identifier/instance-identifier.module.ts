import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { InstanceIdentifierService } from './instance-identifier.service';


@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InstanceIdentifierService,
      multi: true,
    },
  ],
})
export class InstanceIdentifierModule {}
