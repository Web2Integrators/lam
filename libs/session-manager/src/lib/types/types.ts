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

export interface Session {
  sessionID: string;
  toolID: string;
  hostname: string;
  address?: string;
  sessionName: string;
  workerPort: number;
  sessionInactivityTime: number;
  sessionHeartbeatInterval: number;
}

export interface PdeConfig {
  defaultToolAddress: string;
  devBackendUrl: string;
  devCtuUrl: string;
  skipArbitration: boolean;
}
