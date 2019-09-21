import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { WindowRefService } from './window-ref.service';


import { PdeElectronBridgeV1, PdeWindow, Environment, UiMode  } from '../types/types';

export interface BackendLoggingConfig {
  backendLogging: boolean;
  backendUrl: string | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  bridge?: PdeElectronBridgeV1;

  constructor(windowRef: WindowRefService) {
    this.bridge = (windowRef.nativeWindow as PdeWindow).pdeElectronBridgeV1;
  }

  isElectron(): boolean {
    return !!this.bridge;
  }

  getEnvironment(): Promise<Environment | undefined> {
    return (this.bridge && this.bridge.getEnvironment()) || Promise.resolve(undefined);
  }

  async getBackendLoggingConfig(): Promise<BackendLoggingConfig> {
    const env: Environment | undefined = await this.getEnvironment();
    return {
      backendLogging: !!env && env.backendLogging,
      backendUrl: !!env ? env.backendUrl : undefined,
    };
  }

  async isEmbedded(): Promise<boolean> {
    const env: Environment | undefined = await this.getEnvironment();
    return !!env && env.uiMode === UiMode.Embedded;
  }

  closeApplication(): void {
    if (this.bridge) {
      this.bridge.closeApplication();
    }
  }

  getZoomValue(): Observable<number> {
    return !!this.bridge ? (this.bridge.zoom.onChange as Observable<number>) : of(1);
  }

  zoomIn(): void {
    if (this.bridge) {
      this.bridge.zoom.in();
    }
  }

  zoomOut(): void {
    if (this.bridge) {
      this.bridge.zoom.out();
    }
  }

  zoomReset(): void {
    if (this.bridge) {
      this.bridge.zoom.reset();
    }
  }
}
