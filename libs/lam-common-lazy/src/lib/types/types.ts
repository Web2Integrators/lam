export interface GasMapping {
  [gasName: string]: string | null;
}

export interface RcpGasInfo {
  [gasName: string]: {
    GasName: string;
    RcpMaxFlow: number;
  };
}

export interface MfcGasInfo {
  [gasName: string]: {
    GasName: string;
    MaxFlow: number;
  };
}
export interface GasMapError {
  errMsg: string;
  rcpGasInfo: RcpGasInfo;
  mfcGasInfo: MfcGasInfo;
  mapDict: GasMapping;
  nonMappingGases: string[];
}
export interface BackendErrorDetails {
  gasMapErrorMessage: GasMapError;
  canProceed: boolean;
}
export interface BackendError {
  errorName: string;
  details: BackendErrorDetails;
  description: string;
}
/**
 * The desktop application's possible UI modes.
 */
export enum UiMode { Normal, Embedded }

/**
 * The environment object for the desktop application.
 * It is created from the CLI arguments and version.ts.
 */
export interface Environment {
  startX?: number;
  startY?: number;
  width?: number;
  height?: number;
  uiMode: UiMode;
  startHidden: boolean;
  openDevTools: boolean;
  backendLogging: boolean;
  pdeUrl: string;
  defaultToolAddress: string;
  backendUrl?: string;
  ctuUrl?: string;
  banner?: string;
  versionInfo: {
    dirty?: boolean | null;
    raw?: string | null;
    hash?: string | null;
    distance?: any;
    tag?: any;
    semver?: any;
    suffix?: string | null;
    semverString?: string | null;
    version?: string | null;
  };
}
