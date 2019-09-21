import { Resource, MachineResource } from '../types/types';


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
    const pmName = getProcessModuleName(r.machineResourceName);
    if (pmName) {
      const pm = resources.find(resource => resource.machineResourceName === pmName);
      filteredResources.push({
        displayName: pmName,
        machineResourceName: r.machineResourceName,
        locked: r.lockStatus === 'Locked',
        lockInformation: r.lockInformation,
        offline: r.state === 'Offline' || !pm || pm.state === 'Offline',
        pmImage: `${pmName}Image`,
      });
    }
  });

  return filteredResources;
}
