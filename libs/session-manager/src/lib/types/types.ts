export interface LoginCredentials {
  username: string;
  password: string;
}

export interface StoredRoute {
  url?: string;
  params: {
    toolId?: string;
    resourceName?: string;
  };
}

export interface MachineResource {
  displayName: string;
  machineResourceName: string;
  locked: boolean;
  lockInformation: string;
  offline: boolean;
  pmImage: string;
  modelName?: string;
}

export interface HeartbeatResponse {
  remainingInactivityTime: number; // the time in s until the server will time out
  arbitration: Resource[]; // the list of available resources
}

export interface Resource {
  displayName: string;
  lockStatus: string;
  lockType: string;
  lockInformation: string;
  overrideOption: string;
  machineResourceName: string;
  state: string;
}

export interface BackendConfigOptions {
  arbitrationEnabled: boolean;
  endpointEditorEnabled: boolean;
  hydraEditorEnabled: boolean;
}

export interface Session {
  sessionID?: string;
  toolID?: string;
  hostname?: string;
  address?: string;
  sessionName?: string;
  workerPort?: number;
  sessionInactivityTime?: number;
  sessionHeartbeatInterval?: number;
}

export interface PdeConfig {
  defaultToolAddress: string;
  devBackendUrl?: string;
  devCtuUrl?: string;
  banner?: string;
}

export interface HostImage {
  RecipeEditorArbitration: string;
}

export interface PMImage {
  // These commented props are not currently used but do involve existing things in PDE (e.g. MMP):
  // MMPControl: boolean;
  // ModuleType: string;
  // ModuleLabel: string;
  HydraControllerInstalled?: boolean;
  HydraControllerMode?: string;
  OESType?: string;
}

export interface ImageOptions {
  [imageName: string]: HostImage | PMImage; // Keys are "<name>Image", e.g. "HostImage", "PM1Image".
}

export interface MachineConfiguration {
  // MachineConfiguration is a large object. These are only the properties we need.
  imageOptions: ImageOptions;
}

export interface ConfigurationResponse {
  machineConfiguration: MachineConfiguration;
}

/** Message sent from 2300 in a Server Sent Events data field. */
export interface FocusChangedMessage {
  resourceName: string; // e.g. "PM1"
}

/** Possible types sent from 2300 in a Server Sent Events type field. */
export enum SseType {
  FocusChanged = 'FocusChanged',
  HydraTemplateDataChanged = 'HydraTemplateDataChanged',
}

export enum WizardStep {
  Session,
  Login,
  Arbitration,
  Complete,
}

export enum ResetConnectionMode {
  Normal,
  FatalError,
}



export type InvalidState = 'PENDING' | undefined;
