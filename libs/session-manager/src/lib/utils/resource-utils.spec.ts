import { filterResources, getProcessModuleName } from './resource-utils';
import { Resource, MachineResource } from '../types/types';


export const rawResources: Resource[] = [
  {
    displayName: 'AirLock1',
    lockStatus: 'Locked',
    lockType: 'Physical',
    lockInformation: 'Session1',
    overrideOption: 'N / A',
    machineResourceName: 'AirLock1',
    state: 'Offline',
  },
  {
    displayName: 'AirLock2',
    lockStatus: 'Locked',
    lockType: 'Physical',
    lockInformation: 'Session1',
    overrideOption: 'N / A',
    machineResourceName: 'AirLock2',
    state: 'Offline',
  },
  {
    displayName: 'PM1',
    lockStatus: 'Locked',
    lockType: 'Physical',
    lockInformation: 'Session1',
    overrideOption: 'N / A',
    machineResourceName: 'PM1',
    state: 'Online',
  },
  {
    displayName: 'PM2',
    lockStatus: 'Locked',
    lockType: 'Physical',
    lockInformation: 'Session1',
    overrideOption: 'N / A',
    machineResourceName: 'PM2',
    state: 'Online',
  },
  {
    displayName: 'PM3',
    lockStatus: 'Locked',
    lockType: 'Physical',
    lockInformation: 'Session1',
    overrideOption: 'N / A',
    machineResourceName: 'PM2',
    state: 'Offline',
  },
  {
    displayName: 'Recipe Editor ( PM1 )',
    lockStatus: 'Locked',
    lockType: 'Logical',
    lockInformation: 'Session1',
    overrideOption: 'Enabled',
    machineResourceName: 'PM1Recipe',
    state: 'Online',
  },
  {
    displayName: 'Recipe Editor ( PM2 )',
    lockStatus: 'Not Locked',
    lockType: 'Logical',
    lockInformation: '',
    overrideOption: 'Enabled',
    machineResourceName: 'PM2Recipe',
    state: 'Online',
  },
  {
    displayName: 'Recipe Editor ( PM3 )',
    lockStatus: 'Locked',
    lockType: 'Logical',
    lockInformation: 'Session1',
    overrideOption: 'Enabled',
    machineResourceName: 'PM3Recipe',
    state: 'Online',
  },
  {
    displayName: 'wfe',
    lockStatus: 'Locked',
    lockType: 'Logical',
    lockInformation: 'Session1',
    overrideOption: 'Enabled',
    machineResourceName: 'WaferflowEditor',
    state: 'Online',
  },
];

export const filteredResources: MachineResource[] = [
  {
    displayName: 'WaferflowEditor',
    machineResourceName: 'WaferflowEditor',
    locked: true,
    lockInformation: 'Session1',
    offline: false,
    pmImage: 'WaferflowEditorImage',
  },
];

xdescribe('resource-utils', () => {
  describe('getProcessModuleName', () => {
    it('should parse a recipe editor name', () => {
      expect(getProcessModuleName('PM3Recipe')).toEqual('PM3');
    });

    it('should return undefined for a bad recipe editor name', () => {
      expect(getProcessModuleName('foo')).toBeUndefined();
    });

    it('should return undefined for an empty string', () => {
      expect(getProcessModuleName('')).toBeUndefined();
    });
  });

  describe('filterResources', () => {
    it('should filter a list of resources', () => {
      expect(filterResources(rawResources)).toEqual(filteredResources);
    });
  });
});
