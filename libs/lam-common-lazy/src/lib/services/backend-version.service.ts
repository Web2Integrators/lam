import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, of, Observable } from 'rxjs';
import { catchError, takeUntil, map } from 'rxjs/operators';

export interface ICTUVersionResponse {
  softwareMinorVersion: string;
  softwareMajorVersion: string;
  apiServices: {
    lamUIService: string;
    lamHydraService: string;
    processDevelopmentEnvironmentService: string;
    imageService: string;
  };
}

export interface IBackendVersionResponse {
  softwareMajorVersion: string;
  softwareMinorVersion: string;
  apiServices: {
    exampleResourceService: string;
    alarmService: string;
    animationService: string;
    imageService: string;
    hTTPSessionManagerService: string;
    machineService: string;
    lamRecipeService: string;
    lSRaFMService: string;
    mQTTClientService: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class BackendVersionService implements OnDestroy {
  private unsubscribe = new Subject<void>();

  constructor(private http: HttpClient) {}

  getCTUVersion(ctuUrl: string): Observable<string | undefined> {
    const url = `${ctuUrl}/image/v1/versions`;
    return this.http.get<ICTUVersionResponse>(url).pipe(
      //todo:fix any
      map((resp: any) => {
        if (!resp || !resp.apiServices) {
          return undefined;
        }
        return resp.apiServices.lamWaferFlowService;
      }),
      catchError(err => {
        console.log(err);
        return of(undefined);
      }), // If call fails, PDE is not up to date
      takeUntil(this.unsubscribe),
    );
  }

  getBackendVersion(backendUrl: string): Observable<string | undefined> {
    const url = `${backendUrl}/image/v1/versions`;
    return this.http.get<IBackendVersionResponse>(url).pipe(
      takeUntil(this.unsubscribe),
      map(resp => {
        if (!resp || !resp.apiServices) {
          return undefined;
        }
        return resp.softwareMajorVersion;
      }),
      catchError(err => {
        console.log(err);
        return of(undefined);
      }), // If call fails, PDE is not up to date
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
