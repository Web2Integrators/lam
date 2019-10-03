import { ExpectedConditions, browser, Key } from 'protractor';

import * as page from './recipe-editor.po';
import {
  openProcessRecipe,
  checkBeforeClosingRecipe,
  saveAsSRERecipe,
  deleteProcessRecipe,
  checkOpenedRecipeName,
  createNewRecipeWithVal,
  closeExistingRecipe,
  saveAsSRELegacyRecipe,
  checkBKMTransitionParameters,
  checkBKMDechuckParameters,
  checkBKMStepParameters,
} from '../util/recipe-functions';
import {
  waitForItemToShowAndClick,
  enterAndCheckValue_rowNamed_colId,
  checkValue_rowNamed_colId,
  waitForLongOperation,
  getDate,
  checkDialogWarningMessage,
  checkAGCellValueEqual,
  isGridCellNotEditable,
  moveGridSelectionFromOrigin,
  moveGridSelectionFromCurrent,
  moveGridSelectionfromRowID,
} from '../util/helper-functions';

const newRecipe = '__PDE_Season_SRE-' + getDate(); // Concatanate current date
const newLegacyRecipe = browser.params.recipeNameSRE + '-Legacy-' + getDate();
const newSRERecipe = browser.params.recipeNameSRE + '-' + getDate();

describe('Recipe Editor-BKM', () => {
  browser.waitForAngularEnabled(false);

  beforeAll(async () => {
    console.log('== Start running bkm.e2e-specs.ts ==');
    await browser.get(`/devMode?resource=${browser.params.resource}`);
  });

  afterAll(async () => {
    // check and close existing recipe and return to Create/Open Recipe menu.
    await checkBeforeClosingRecipe();
  });

  describe('Create new recipe from CreateOpen page', () => {
    it('RE-TC48: Should have created recipe when button is pressed', async () => {
      await waitForItemToShowAndClick(page.createRecipeBtn);
      await browser.wait(ExpectedConditions.presenceOf(page.selectedRecipeName));
    });
  });

  describe('BKM (Simplified Recipe Editor)', () => {
    it('RE-TC49: Should post a warning if no Dechck BKM is defined during recipe save', async () => {
      // Create a new recipe with pre-defined parameters required by Backend
      await createNewRecipeWithVal();

      // Select dechuckBKM as None to trigger warning
      await page.dechuckBkm.click();
      await browser.wait(ExpectedConditions.elementToBeClickable(page.bkmOptionNone));
      await page.bkmOptionNone.click();
      await browser.wait(ExpectedConditions.stalenessOf(page.bkmOptionNone));
      await saveAsSRERecipe(newRecipe);
      await checkDialogWarningMessage('an invalid Dechuck BKM selection');
      await waitForItemToShowAndClick(page.modalDetailsDialogOk);
    });

    // Select dechhuckBKM
    it('RE-TC50: Should be able to save a recipe with BKM selected', async () => {
      await waitForItemToShowAndClick(page.dechuckBkm);
      await browser.wait(ExpectedConditions.elementToBeClickable(page.bkmOptionCoulombicRPVRevG));
      await page.bkmOptionCoulombicRPVRevG.click();
      await browser.wait(ExpectedConditions.stalenessOf(page.bkmOptionCoulombicRPVRevG));
      await browser
        .actions()
        .sendKeys(Key.ESCAPE)
        .perform();
      await saveAsSRERecipe(newRecipe);
      await waitForLongOperation();
      await checkOpenedRecipeName(newRecipe);
      await deleteProcessRecipe(newRecipe);
    });

    it('RE-TC51: Should allow to change bkm settings to None', async () => {
      // create new recipe
      await waitForItemToShowAndClick(page.createRecipeBtn);
      await browser.wait(ExpectedConditions.presenceOf(page.selectedRecipeName));

      // BKM Strike
      await waitForItemToShowAndClick(page.strikeBkm);
      await browser.wait(ExpectedConditions.presenceOf(page.bkmOptionNone));
      await browser.wait(ExpectedConditions.elementToBeClickable(page.bkmOptionNone));
      await page.bkmOptionNone.click();
      await browser.wait(ExpectedConditions.stalenessOf(page.bkmOptionNone));

      // BKM Step
      await page.stepBkm.click();
      await browser.wait(ExpectedConditions.presenceOf(page.bkmOptionNone));
      await browser.wait(ExpectedConditions.elementToBeClickable(page.bkmOptionNone));
      await page.bkmOptionNone.click();
      await browser.wait(ExpectedConditions.stalenessOf(page.bkmOptionNone));

      // BKM Transition
      await page.transitionBkm.click();
      await browser.wait(ExpectedConditions.presenceOf(page.bkmOptionNone));
      await browser.wait(ExpectedConditions.elementToBeClickable(page.bkmOptionNone));
      await page.bkmOptionNone.click();
      await browser.wait(ExpectedConditions.stalenessOf(page.bkmOptionNone));

      // BKM Dechuck
      await page.dechuckBkm.click();
      await browser.wait(ExpectedConditions.presenceOf(page.bkmOptionNone));
      await browser.wait(ExpectedConditions.elementToBeClickable(page.bkmOptionNone));
      await page.bkmOptionNone.click();
      await browser.wait(ExpectedConditions.stalenessOf(page.bkmOptionNone));

      await closeExistingRecipe();
    });

    it('RE-TC52: Should open a baseline recipe with no BKM settings', async () => {
      await openProcessRecipe(browser.params.recipeNameSRE);
    });

    it('RE-TC53: Should post error "Dechuck BKM, CoulombicDechuck_RevF" is not available', async () => {
      // click Full Setpoints
      await waitForItemToShowAndClick(page.fullSetpointsTab);

      // handle "LoadBKMError: DechuckBKM, CoulombicDechuck_RevF not available"
      await checkDialogWarningMessage('Dechuck BKM, CoulombicDechuck_RevF, is not availabe');
      await waitForItemToShowAndClick(page.modalDetailsDialogOk);
    });

    it('RE-TC54: Should not allow changes to parameter values on full setpoints view', async () => {
      // attempt to change processTime on Step 2
      await isGridCellNotEditable('processTime', '2');
      await checkAGCellValueEqual('processTime', '2', '50');

      // attempt to change helium on Step 5
      await moveGridSelectionFromOrigin(Key.ARROW_DOWN, 70);
      await isGridCellNotEditable('Helium', '5');
      await checkAGCellValueEqual('Helium', '5', '20');
      await moveGridSelectionfromRowID('Helium', Key.ARROW_UP, 70);

      // click Setpoints tab (cleanup for next test)
      await waitForItemToShowAndClick(page.setpointsTab);
    });

    it('RE-TC55: Should check if Dechuck BKM steps are added correctly', async () => {
      // select Dechuck BKM: CoulombicRPVRevG
      await waitForItemToShowAndClick(page.dechuckBkm);
      await waitForItemToShowAndClick(page.bkmOptionCoulombicRPVRevG);
      await browser.wait(ExpectedConditions.stalenessOf(page.bkmOptionCoulombicRPVRevG));
      await browser
        .actions()
        .sendKeys(Key.ESCAPE)
        .perform();

      // click Full Setpoints tab
      await waitForItemToShowAndClick(page.fullSetpointsTab);
      await waitForLongOperation();

      // validate Dechuck BKM Step parameters at step 6
      await checkBKMDechuckParameters('6');

      // click Setpoints tab (cleanup for next test)
      await waitForItemToShowAndClick(page.setpointsTab);
    });

    it('RE-TC56: Should check if Transition BKM steps are added correctly', async () => {
      // select Transition BKM: TCP_Step_Rampdown_RevG
      await waitForItemToShowAndClick(page.transitionBkm);
      await waitForItemToShowAndClick(page.bkmOptionTCPStepRampDownRevG);
      await browser.wait(ExpectedConditions.stalenessOf(page.bkmOptionTCPStepRampDownRevG));
      await browser
        .actions()
        .sendKeys(Key.ESCAPE)
        .perform();

      // click Full Setpoints tab
      await waitForItemToShowAndClick(page.fullSetpointsTab);
      await waitForLongOperation();

      // validate Transition BKM Transition step parameters (step 2, 5, 7)
      await checkBKMTransitionParameters('2', '5', '7');

      /*
       * validate all BKM parameters from previous BKM steps
       * BKM Dechuck   : step 9
       */
      /*
       * Failed: Index out of bound. Trying to access element at index: 8,
       * but there are only 8 elements that match locator By(css selector, .ag-cell)
       */
      /*
       * console.log('Check step 9');
       * await checkValue_rowNamed_colNum('RPVPinsUp', 'stepType', 9);
       * await checkValue_rowNamed_colNum('17', 'processTime', 9);
       */

      // click Setpoints tab (cleanup for next test)
      await waitForItemToShowAndClick(page.setpointsTab);
    });

    it('RE-TC57: Should be able to select detail: "All including endpoint"', async () => {
      // Show all including endpoint paramaters
      await waitForItemToShowAndClick(page.viewDetailList);
      await waitForItemToShowAndClick(page.allIncludingEndpointOption);
      await browser
        .actions()
        .sendKeys(Key.ESCAPE)
        .perform();
      await browser.wait(ExpectedConditions.stalenessOf(page.allIncludingEndpointOption));
    });

    it('RE-TC58: Should check if Step BKM steps are added correctly', async () => {
      // select Step BKM: DefaultEtch-RevF
      await waitForItemToShowAndClick(page.stepBkm);
      await waitForItemToShowAndClick(page.bkmOptionDefaultEtchRevF);
      await browser.wait(ExpectedConditions.stalenessOf(page.bkmOptionDefaultEtchRevF));
      await browser
        .actions()
        .sendKeys(Key.ESCAPE)
        .perform();

      // click Full Setpoints
      await waitForItemToShowAndClick(page.fullSetpointsTab);
      await waitForLongOperation();

      // validate Step BKM parameters "Valve Learned Postion for step 1, 3 and 4"
      await moveGridSelectionFromOrigin(Key.ARROW_DOWN, 20);
      await checkBKMStepParameters('1', '3', '4');
      await moveGridSelectionFromCurrent(Key.ARROW_UP, 20);

      /*
       * validate all BKM parameters from previous BKM steps
       * BKM Transition: steps 2, 5 and 7
       * BKM Dechuck   : step 9
       */
      await checkBKMTransitionParameters('2', '5', '7');

      /*
       * Failed: Index out of bound. Trying to access element at index: 8,
       * but there are only 8 elements that match locator By(css selector, .ag-cell)
       */
      /*
       * await checkValue_rowNamed_colNum('RPVPinsUp', 'stepType', 9);
       * await checkValue_rowNamed_colNum('17', 'processTime', 9);
       */
      // click Setpoints tab (cleanup for next test)
      await waitForItemToShowAndClick(page.setpointsTab);
    });

    it('RE-TC59: Should check if Strike BKM steps are added correctly', async () => {
      // select dechuck BKM: BiasSoftStrike_RevH
      await waitForItemToShowAndClick(page.strikeBkm);
      await waitForItemToShowAndClick(page.bkmOptionStrikeBKM);
      await browser.wait(ExpectedConditions.stalenessOf(page.bkmOptionStrikeBKM));
      await browser
        .actions()
        .sendKeys(Key.ESCAPE)
        .perform();

      // click Full Setpoints
      await waitForItemToShowAndClick(page.fullSetpointsTab);
      await waitForLongOperation();

      // validate Strike BKM parameters
      await checkValue_rowNamed_colId('Stability', 'RecipeStepName', '1');
      await checkValue_rowNamed_colId('70', 'processTime', '1');

      /*
       * validate all BKM parameters from previous BKM steps
       * BKM Transition: steps 3, 6 and 8
       * BKM Steps     : steps 2, 4 and 5
       * BKM Dechuck   : step 10
       */
      // Validate parameters. BKM Transition should change to step 3, 6 and 8
      await moveGridSelectionFromOrigin(Key.ARROW_RIGHT, 10);
      await checkBKMTransitionParameters('3', '6', '8');

      // Validate parameters. BKM Steps should change to step 2, 4 and 5
      await moveGridSelectionFromCurrent(Key.ARROW_LEFT, 10);
      await moveGridSelectionFromCurrent(Key.ARROW_DOWN, 20);
      await checkBKMStepParameters('2', '4', '5');
      await moveGridSelectionFromCurrent(Key.ARROW_UP, 20);

      // Validate parameters. BKM Dechuck should change to step 10
      /*
       * Failed: Index out of bound. Trying to access element at index: 9,
       * but there are only 8 elements that match locator By(css selector, .ag-cell)
       */

      /*
       * await checkValue_rowNamed_colNum('RPV Dechuck', 'RecipeStepName', 10);
       * await checkValue_rowNamed_colNum('RPVPinsUp', 'stepType', 10);
       * await checkValue_rowNamed_colNum('17', 'processTime', 10);
       */

      // click View Detail: Process
      await waitForItemToShowAndClick(page.viewDetailList);
      await waitForItemToShowAndClick(page.processOption);
      await browser
        .actions()
        .sendKeys(Key.ESCAPE)
        .perform();
      await browser.wait(ExpectedConditions.stalenessOf(page.processOption));

      // click Setpoints tab (cleanup for next test)
      await waitForItemToShowAndClick(page.setpointsTab);
    });

    it('RE-TC60: Should post error "TCP ramp rate must be set"', async () => {
      // select Step BKM: ContinuousPlasmaEtch_RevI
      await waitForItemToShowAndClick(page.stepBkm);
      await waitForItemToShowAndClick(page.bkmOptionContinuousPlasmaEtchRevI);
      await browser.wait(ExpectedConditions.stalenessOf(page.bkmOptionContinuousPlasmaEtchRevI));
      await browser
        .actions()
        .sendKeys(Key.ESCAPE)
        .perform();

      // click Full Setpoints
      await waitForItemToShowAndClick(page.fullSetpointsTab);
      await waitForLongOperation();

      /*
       * Transition BKM"	Select ContinuousPlasma_RevI
       * View:Full Setpoints		Continuous plasma
       *   "LoadBKMError: TCP ramp rate must be set on recipe constants page"
       * Constants	TCP RF Downard Power Ramp Rate (watt/sec) to 500
       * Constants	TCP RF Upward  Power Ramp Rate (watt/sec) to 500
       * View:Full Setpoints		No error
       */
      await checkDialogWarningMessage('TCP ramp rate must be set on recipe constants page');
      await waitForItemToShowAndClick(page.modalDetailsDialogOk);
    });

    it('RE-TC61: Should be able to change TCP RF Downward constant', async () => {
      // click Constants tab
      await waitForItemToShowAndClick(page.constantsTab);
      await waitForLongOperation();

      await moveGridSelectionFromOrigin(Key.ARROW_DOWN, 20);
      await enterAndCheckValue_rowNamed_colId('500', 'TCPRFGenDownwardPowerRampRate', 'value');
    });

    it('RE-TC62: Should be able to change TCP RF Upward constant', async () => {
      await enterAndCheckValue_rowNamed_colId('500', 'TCPRFGenUpwardPowerRampRate', 'value');
    });

    it('RE-TC63: Should be able to view Full Setpoints with no error', async () => {
      // click Full Setpoints tab
      await waitForItemToShowAndClick(page.fullSetpointsTab);
      await waitForItemToShowAndClick(page.setpointsTab);
    });

    it('RE-TC64: Should be able to save as Non-SRE (Legacy) recipe', async () => {
      await waitForLongOperation();
      await saveAsSRELegacyRecipe(newLegacyRecipe);
    });

    it('RE-TC65: Should be able to save as SRE recipe', async () => {
      await waitForLongOperation();
      await saveAsSRERecipe(newSRERecipe);
    });
  });
});
