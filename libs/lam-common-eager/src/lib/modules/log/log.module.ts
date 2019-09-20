import { NgModule } from '@angular/core';

import { LogEntries } from './log.service';

@NgModule({
  providers: [LogEntries],
})
export class LogModule {}
