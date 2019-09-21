import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppErrorHandlingModule } from '../app-level-error/app-error-handling.module';
import { AppLoggingModule } from '../app-level-log/app-logging.module';
import { HttpProgressModule } from '../http-progress/http-progress.module';
import { InstanceIdentifierModule } from '../instance-identifier/instance-identifier.module';
const eagerModules = [
  CommonModule,
  AppErrorHandlingModule,
  AppLoggingModule,
  HttpProgressModule,
  InstanceIdentifierModule
]
@NgModule({
  imports: [... eagerModules],
  exports : [... eagerModules]
})
export class LamCommonEagerModule {}
