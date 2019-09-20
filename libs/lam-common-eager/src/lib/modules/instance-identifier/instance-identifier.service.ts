import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as uuid from 'uuid/v1';

// Each client instance has a unique identifier attached to HTTP request headers. The node server
// uses these identifiers to map the instances to CTU sessions on the backend.

@Injectable()
export class InstanceIdentifierService implements HttpInterceptor {
  private instanceID = uuid();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const instanceReq = req.clone({ headers: req.headers.set('instance-id', this.instanceID) });
    return next.handle(instanceReq);
  }
}
