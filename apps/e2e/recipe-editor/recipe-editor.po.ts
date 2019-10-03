import { $, element, by, $$ } from 'protractor';

import { getAgHeaderCell } from '../util/selector-functions';

// Waiting visual (contains the spinner)
export const waitingVisual = $('[e2e = waitingVisual]');

// Create Recipe button from starting screen
export const createRecipeBtn = $('[e2e = createBtn]');
export const openRecipeBtn = $('[e2e = openBtn]');
export const createOrOpenRecipeTitle = element(
  by.cssContainingText('.mat-card-title', 'Create or Open Recipe'),
);

// Recipe Selector elements
export const recipeSelectorModalHeader = element(
  by.cssContainingText('.mat-dialog-title', 'Select Recipe'),
);
export const recipeFilter = $('.ag-floating-filter-input');
export const recipeToSelect = $$('.ag-cell').get(0); // Does not work if several recipes exist

export const selectRecipeBtn = $('[e2e = selectRecipeBtn]');

// Navigation Tabs
export const setpointsTab = $$('.mat-tab-label').get(0);
export const constantsTab = $$('.mat-tab-label').get(1);
export const validationTab = $$('.mat-tab-label').get(2);
export const fullSetpointsTab = $$('.mat-tab-label').get(3);

// Element that holds name of current recipe
export const selectedRecipeName = $('[e2e = selectedRecipeName]');

// Add step button
export const toggleTolerancesBtn = $('[e2e = toggleToleranceBtn]');
export const addStepBtn = $('[e2e = addStepBtn]');
export const resetLearnedValuesBtn = $('[e2e = resetLearnedValuesBtn]');

// Elements for the recipe-level bkm dropdowns and dropdown options
export const strikeBkm = $('[e2e = strikeBkm]');
export const stepBkm = $('[e2e = stepBkm]');
export const transitionBkm = $('[e2e = transitionBkm]');
export const dechuckBkm = $('[e2e = dechuckBkm]');
export const bkmOptionNone = $$('[e2e = matOption]').get(1);
export const bkmOptionCoulombicDechuckRevG = $$('[e2e = matOption]').get(2);
export const bkmOptionCoulombicRPVRevG = $$('[e2e = matOption]').get(3);
export const bkmOptionTCPStepRampDownRevG = $$('[e2e = matOption]').get(4);
export const bkmOptionContinuousPlasmaEtchRevI = $$('[e2e = matOption]').get(2);
export const bkmOptionDefaultEtchRevF = $$('[e2e = matOption]').get(3);
export const bkmOptionStrikeBKM = $$('[e2e = matOption]').get(2);

// ag-grid elements
export const agInput = $('.ag-cell-edit-input');
export const agGridCellOrigin = $('.ag-body-container')
  .$('[row-index = "0"]')
  .$$('.ag-cell')
  .get(0);
export const headerCell2 = getAgHeaderCell(1);
export const headerCell3 = getAgHeaderCell(2);
export const headerMenuBtn1 = $$('.customHeaderMenuButton').get(0);
export const headerMenuBtn2 = $$('.customHeaderMenuButton').get(1);
export const headerMenuBtn3 = $$('.customHeaderMenuButton').get(2);
export const headerMenuBtn4 = $$('.customHeaderMenuButton').get(3);
export const headerMenuBtn5 = $$('.customHeaderMenuButton').get(4);
export const headerMenuBtn6 = $$('.customHeaderMenuButton').get(5);
export const headerMenuBtn7 = $$('.customHeaderMenuButton').get(6);
export const headerMenuBtn8 = $$('.customHeaderMenuButton').get(7);
export const headerMenuBtn9 = $$('.customHeaderMenuButton').get(8);
export const headerMenuBtn10 = $$('.customHeaderMenuButton').get(9);

// Buttons in the grid step menu
export const copyStep = $('[e2e = copyStep]');
export const pasteStep = $('[e2e = pasteStep]');
export const replaceStep = $('[e2e = replaceStep]');
export const insertStep = $('[e2e = insertNewStep]');
export const deleteStep = $('[e2e = deleteStep]');
export const disableMmpEditor = $('[e2e = disableMmpEditor]');
export const enableMmpEditor = $('[e2e = enableMmpEditor]');
export const openEpEditor = $('[e2e = openEpEditor]');
export const openLegacyEpEditor = $('[e2e = openLegacyEpEditor]');

// File dropdown and its buttons
export const fileDropdown = $('[e2e = fileDropdown]');
export const saveAsBtn = $('[e2e = saveAsBtn]');
export const deleteBtn = $('[e2e = deleteBtn]');
export const closeBtn = $('[e2e = closeBtn]');
export const newBtn = $('[e2e = newBtn]');

// File dropdown and filters element - delete recipes
export async function recipeFromList(value: string) {
  return element(by.cssContainingText('.mat-option-text', value));
}
export const deleteRecipeBtn = $('[e2e = selectRecipeBtn]');
export const recipeSelectorToDelete = $('[e2e = recipeSelector]');

// Elements from the Save As dialog
export const saveAsInput = $('[e2e = dialogInput]');
export const saveDialogBtn = $('[e2e = saveBtn]');
export const sreEnabledOption = element(by.cssContainingText('.mat-checkbox', 'SRE-Enabled'));
export const sreCheckBoxNotChecked = element(by.cssContainingText('.aria-checked', 'true'));
export const processRecipeOption = element(by.cssContainingText('.mat-radio-button', 'Process'));
export const cleanRecipeOption = element(by.cssContainingText('.mat-radio-button', 'Clean'));
export const dialogWarningMessage = $$('.mat-dialog-content').get(0);

// Buffer dropdown and its options
export const bufferBtn = $('[e2e = selectedRecipeName]');
export const recipeInBufferBtn = element(by.buttonText('test-recipe'));

// Elements from the validation page
export const validateTab = $$('.mat-tab-label').get(2);
export const validateBtn = $('[e2e = validateBtn]');
export const validationTable = $('[e2e = validationTable]');

// --- Modals elements ---
// Details dialog modal
export const modalDetailsDialogTitle = $('[e2e = detailsDialogTitle]');
export const modalDetailsDialogOk = $('[e2e = detailsDialogOk]');
export const modalDetailsDialogNo = $('[e2e = detailsDialogNo]');
export const modalDetailsDialogYes = $('[e2e = detailsDialogYes]');

// confirmation dialog modal
export const confirmationDialogDo = $('[e2e = detailsDialogDo]');
export const confirmationDialogDoNot = $('[e2e = detailsDialogDoNot]');
export const discardChangesBtn = element(by.buttonText('DISCARD CHANGES'));

// Filters elements
export const filterField = $('[e2e = filterField]');
export const subsystemsFilterList = $('[e2e = subsystemsFilterList]');
export const hideSubsystemsOption = element(
  by.cssContainingText('.mat-button-wrapper', 'Hide Subsystems'),
);
export const rfSubsystemsOption = element(
  by.cssContainingText('.mat-option-text', new RegExp('^RF$')),
);
export const stepSubsystemsOption = element(
  by.cssContainingText('.mat-option-text', new RegExp('^Step$')),
);
export const reactantsSubsystemsOption = element(
  by.cssContainingText('.mat-option-text', new RegExp('^Reactants$')),
);
export const chuckSubsystemsOption = element(
  by.cssContainingText('.mat-option-text', new RegExp('^Chuck$')),
);

export const viewDetailList = $('[e2e = viewDetailList]');
export const processAndSystemOption = element(
  by.cssContainingText('.mat-option-text', new RegExp('^ Process & system $')),
);
export const processOption = element(
  by.cssContainingText('.mat-option-text', new RegExp('^ Process $')),
);
export const allIncludingEndpointOption = element(
  by.cssContainingText('.mat-option-text', new RegExp('^ All including endpoint $')),
);
export const aRandomGreyItem = element(by.cssContainingText('.ag-cell', 'Iterative EndPT Policy'));
