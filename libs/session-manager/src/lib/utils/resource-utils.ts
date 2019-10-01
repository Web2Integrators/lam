import { Resource, MachineResource, MachineConfiguration, BackendConfigOptions, InvalidState, HostImage, PMImage } from '../types/types';
import {  isUndefined } from 'lodash';

/**
 * Given a recipe editor resource name ('PM3Recipe'), returns the process module portion ('PM3'),
 * or undefined if this is not a recipe editor resource name.
 */
export function getProcessModuleName(recipeEditorName: string): string | undefined {
  const matches = recipeEditorName.match(/^(PM\d+)Recipe$/);
  return matches ? matches[1] : undefined;
}

/**
 * Receives a list of resources from the backend, and returns only the process modules, based on a
 * string match of the machine names.
 *
 * @param resources full list of resources from backend
 */
export function filterResources(resources: Resource[]): MachineResource[] {
  const filteredResources: MachineResource[] = [];
  resources.forEach(r => {
   // const pmName = getProcessModuleName(r.machineResourceName);
    //todo :find better way
    if (r.machineResourceName === 'WaferflowEditor' ) {
      const pm = resources.find(resource => resource.machineResourceName === r.machineResourceName);
      filteredResources.push({
        displayName: r.machineResourceName,
        machineResourceName: r.machineResourceName,
        locked: r.lockStatus === 'Locked',
        lockInformation: r.lockInformation,
        offline: r.state === 'Offline' || !pm || pm.state === 'Offline',
        pmImage: `${r.machineResourceName}Image`,
      });
    }
  });

  return filteredResources;
}

/** Get the name of the resource lock (e.g. "PMxRecipe") from the name (e.g. "PMx") */
//Todo
export const getResourceLockName = (resourceName: string) => `${resourceName}`;

/** Determine whether the resource name is a process module and strip undefined from the type. */
export const isProcessModule = (resourceName?: string): boolean => {
  return !!resourceName && resourceName.startsWith('PM');
};

/**
 * Get the backend configuration options (dynamic feature guards) from a machine configuration.
 * Rules:
 * 1. arbitrationEnabled is true iff ("if and only if"):
 *  - String(imageOptions.HostImage.RecipeEditorArbitration) is not "Disable" (case-insensitive).
 * 2. endpointEditorEnabled is true iff:
 *  - resourceName is not an empty string, and
 *  - imageOptions.PM#Image.OESType is defined, and
 *  - String(imageOptions.PM#Image.OESType) is not "None" (case-insensitive).
 * 3. hydraEditorEnabled is true iff:
 *  - resourceName is not an empty string, and
 *  - imageOptions.PM#Image.HydraControllerInstalled is truthy, and
 *  - String(imageOptions.PM#Image.HydraControllerMode) is "Enable" (case-insensitive).
 * @param config The machine configuration object.
 */
//todo : | InvalidState removed
export function extractBackendConfig(config: MachineConfiguration | InvalidState, resourceName: string): BackendConfigOptions | InvalidState {
  //todo
  if (!config || config === 'PENDING') {
    return 'PENDING';
  }
  const hostImage = config.imageOptions.HostImage as HostImage;
  let endpointEditorEnabled = false;
  let hydraEditorEnabled = false;
  if (isProcessModule(resourceName)) {
    const pmOpts = config.imageOptions[`${resourceName}Image`] as PMImage;
    if (!pmOpts) {
      throw new Error(`Options not found in machine configuration for resource "${resourceName}"`);
    }
    const oesType: string | undefined = pmOpts.OESType;
    endpointEditorEnabled = !isUndefined(oesType) && String(oesType).toLowerCase() !== 'none';
    const hydraControllerInstalled: boolean = !!pmOpts.HydraControllerInstalled;
    const hcmEnabled: boolean = String(pmOpts.HydraControllerMode).toLowerCase() === 'enable';
    hydraEditorEnabled = hydraControllerInstalled && hcmEnabled;
  }
  return {
    arbitrationEnabled: String(hostImage.RecipeEditorArbitration).toLowerCase() !== 'disable',
    endpointEditorEnabled,
    hydraEditorEnabled,
  };
}
