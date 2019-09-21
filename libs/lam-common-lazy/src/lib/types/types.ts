//todo
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
//todo
export enum ConnectionErrorCode {
  sessionIDNotFound = 'SessionIDNotFound',
  ctuWorkersUnavailable = 'CTUWorkersUnavailable',
  userLoginFailed = 'UserLoginFailed',
  invalidBackendVersion = 'InvalidBackendVersion',
  unknown = 'Unknown',
}





interface ObservableLike<T> {
  pipe: (...args: any[]) => ObservableLike<T>;
  subscribe: (success?: (result: T) => void, error?: (err: any) => void) => {
    unsubscribe: () => void;
  };
}

/**
 * Additional properties to add to the Window object for the preload bridge. This API allows the
 * web app (PDE) to communicate with the Electron application.
 */
export interface PdeWindow extends Window {
  /** The bridge object, i.e. the API that PDE uses to communicate with the Electron app. */
  pdeElectronBridgeV1: PdeElectronBridgeV1;
  /** For security reasons, we override the window's eval function with a "no-op" function. */
  eval: () => void;
}

/**
 * Version 1 of the PDE<-->Electron API (preload bridge) that is attached to the Window object.
 */
export interface PdeElectronBridgeV1 {
  /** Force quits the application immediately */
  closeApplication: () => void;
  /** Open the configuration window. */
  showConfigWindow: () => void;
  /** Reload PDE at the URL in the current configuration. */
  retryLoadPDE: () => void;
  /** Open the legacy endpoint editor executable with base64 blob of the OES file's contents. */
  launchEpEditor: (blob: string) => Promise<{ error: any } | string | null>;
  /** Force close the legacy endpoint editor. */
  closeEpEditor: () => void;
  /** Get the details of the last load failure, e.g. for the did-fail-load page. */
  getLastLoadFailure: () => Promise<string>;
  /** Get the environment object. */
  getEnvironment: () => Promise<Environment>;
  zoom: {
    in: () => void;
    out: () => void;
    reset: () => void;
    onChange: ObservableLike<number>;
  };
}
