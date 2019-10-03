/**
 * EndPointEditor e2e tests for Step 1: Integration Bands (IBs)
 */

import { browser, ExpectedConditions, Key } from 'protractor';

import * as pageRecipe from '../recipe-editor/recipe-editor.po';
import * as pageEE from './endpoint-editor.po';
import { checkBeforeClosingRecipe } from '../util/recipe-functions';
import {
  waitForItemToShowAndClick,
  waitForItemToShowWaitAndClick,
  waitForLongOperation,
  enterAndCheckCellValueByGridGroup,
  scrollUpDownInElement,
  checkAgCellValueByGridGroup,
  checkAgInvalidCellValuePresentByGridGroup,
  verifyAgInvalidCellAbsentByGridGroup,
} from '../util/helper-functions';
import {
  discardEndPointChanges,
  enterAndCheckBFCellValue,
  selectIBSignalChannel,
  selectFilterType,
  enterSamples,
  enterHighCutOffFrequency,
} from '../util/endpoint-functions';
import { cssElementContainingText } from '../util/selector-functions';

describe('Endpoint Editor - Step 1', () => {
  browser.waitForAngularEnabled(false);

  beforeAll(async () => {
    console.log('== Start running s1-integrationBands.e2e-specs.ts ==');
    await browser.get(`/devMode?resource=${browser.params.resource}`);
  });

  afterAll(async () => {
    // check and close existing recipe and return to Create/Open Recipe menu.
    await discardEndPointChanges();
    await checkBeforeClosingRecipe();
  });

  describe('Integration Bands (IBs)', () => {
    it('EE-TC1: Should open Endpoint Editor (New Recipe)', async () => {
      await waitForItemToShowAndClick(pageRecipe.createRecipeBtn);
      await browser.wait(ExpectedConditions.presenceOf(pageRecipe.selectedRecipeName));

      // Open EndPoint Editor from Step1
      await waitForItemToShowWaitAndClick(pageRecipe.headerMenuBtn1);
      await waitForItemToShowWaitAndClick(pageRecipe.openEpEditor);
    });

    it('EE-TC2: Should be able to select Integration Bands step', async () => {
      await waitForItemToShowAndClick(pageEE.integrationBandsStep);
    });

    it('EE-TC3: Should show "Create" icon on Integration Bands step', async () => {
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBCreate));
    });

    it('EE-TC4: Should show "Warning" icon on Algorithms step', async () => {
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconAlgorithmsWarning));
    });

    it('EE-TC5: Should be able to enter value "-5"  on IB2 wavelength', async () => {
      await enterAndCheckCellValueByGridGroup('ibGroup', 'IB2', 'wavelength', '-5');
    });

    it('EE-TC6: Should be able to go to Basis functions (BFs) page', async () => {
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBCreate));
      await waitForItemToShowAndClick(pageEE.basisFunctionStep);
      await waitForLongOperation();
    });

    it('EE-TC7: Should be able to enter "IB2" on BF2 row', async () => {
      await enterAndCheckBFCellValue('BF2', 'equation', 'IB2');
      await waitForLongOperation();
    });

    it('EE-TC8: Should show "Warning" icon on IB step', async () => {
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBWarning));
    });

    it('EE-TC9: Should show red line "undefined IB" on BF page', async () => {
      await checkAgInvalidCellValuePresentByGridGroup('bfGroup', 'title', 'IB2 is undefined');
    });

    it('EE-TC10: Should show "Warning" icon on BF step', async () => {
      // Switch back to IB step
      await waitForItemToShowAndClick(pageEE.integrationBandsStep);
      await waitForLongOperation();
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBCreate));
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconBasicFunctionsWarning));
    });

    // tslint:disable-next-line:max-line-length
    it('EE-TC11: Should show red line "The minimum legal value is undefined on IB page', async () => {
      await checkAgInvalidCellValuePresentByGridGroup(
          'ibGroup', 'title', 'The minimum legal value is undefined');
    });

    it('EE-TC12: Should be able to enter value "2000"  on IB2 wavelength', async () => {
      await enterAndCheckCellValueByGridGroup('ibGroup', 'IB2', 'wavelength', '2000');
    });

    it('EE-TC13: Should show "undefined IB" on BF page', async () => {
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBCreate));
      await waitForItemToShowAndClick(pageEE.basisFunctionStep);
      await waitForLongOperation();
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconBasicFunctionsCreate));
      await enterAndCheckBFCellValue('BF2', 'equation', 'IB2');
      await waitForLongOperation();
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBWarning));
      await checkAgInvalidCellValuePresentByGridGroup('bfGroup', 'title', 'IB2 is undefined');
    });

    it('EE-TC14: Should show "The maximum legal value is 1000" on IB page', async () => {
      await waitForItemToShowAndClick(pageEE.integrationBandsStep);
      await waitForLongOperation();
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBCreate));
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconBasicFunctionsWarning));
      await checkAgInvalidCellValuePresentByGridGroup(
        'ibGroup', 'title', 'The maximum legal value is 1000');
    });

    it('EE-TC15: Should be able to enter value "500"  on IB2 wavelength', async () => {
      await enterAndCheckCellValueByGridGroup('ibGroup', 'IB2', 'wavelength', '500');
      await waitForItemToShowAndClick(pageEE.basisFunctionStep);
      await waitForLongOperation();
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconBasicFunctionsCreate));
      await enterAndCheckBFCellValue('BF2', 'equation', 'IB2');
    });

    it('EE-TC16: Should show "Done" icon on IB step', async () => {
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBDone));
    });

    it('EE-TC17: Should show "Done" icon on BF step', async () => {
      await waitForItemToShowAndClick(pageEE.algorithmsStep);
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconBasicFunctionsDone));
    });

    it('EE-TC18: Should be able to enter value "-5"  on IB2 bandwidth', async () => {
      await waitForItemToShowAndClick(pageEE.integrationBandsStep);
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBCreate));
      await enterAndCheckCellValueByGridGroup('ibGroup', 'IB2', 'bandwidth', '-5');
    });

    it('EE-TC19: Should show "The minimum legal value is 0" on IB2 bandwidth', async () => {
      await checkAgInvalidCellValuePresentByGridGroup(
        'ibGroup', 'title', 'The minimum legal value is 0');
    });

    it('EE-TC20: Should show "Should be able to enter value "10" on IB2 bandwidth', async () => {
      await enterAndCheckCellValueByGridGroup('ibGroup', 'IB2', 'bandwidth', '10');
      await waitForItemToShowAndClick(pageEE.basisFunctionStep);
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBDone));
      await waitForItemToShowAndClick(pageEE.algorithmsStep);
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconBasicFunctionsDone));
    });

    it('EE-TC21: Should be able to select "OESMaster" Signal Channel on IB1', async () => {
      await waitForItemToShowAndClick(pageEE.integrationBandsStep);
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBCreate));
      const signalOESMasterOption = cssElementContainingText(
        '.mat-option-text',
        new RegExp('^OESMaster$'),
      );
      await selectIBSignalChannel('IB1', 'filterType', signalOESMasterOption);
    });

    it('EE-TC22: Should be able to select "FIR" Filter Type on IB1', async () => {
      await waitForItemToShowAndClick(pageEE.integrationBandsStep);
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBCreate));
      const filterFIROption = cssElementContainingText('.mat-option-text', new RegExp('^ FIR $'));
      await selectFilterType('ibGroup', 'IB1', 'filterType', filterFIROption);
    });

    it('EE-TC23: Should be able to enter "-5" in No. of Samples', async () => {
      await waitForItemToShowAndClick(pageEE.integrationBandsStep);
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBCreate));
      await enterSamples('ibGroup', 'IB1', 'filterType', '-5');
    });

    it('EE-TC24: Should be able click Apply button', async () => {
      await waitForItemToShowAndClick(pageEE.applyParametersIBBtn);
    });

    it('EE-TC25: Should post error if negative value is entered', async () => {
      await checkAgInvalidCellValuePresentByGridGroup(
        'ibGroup', 'title', 'Parameter numSamples is invalid');
      await browser.wait(ExpectedConditions.presenceOf(pageEE.errorNegativeInteger));
    });

    it('EE-TC26: Should be able to enter "5" in No. of Samples', async () => {
      await waitForItemToShowAndClick(pageEE.integrationBandsStep);
      await enterSamples('ibGroup', 'IB1', 'filterType', '5');
      await waitForItemToShowAndClick(pageEE.applyParametersIBBtn);
    });

    it('EE-TC27: Should NOT post error if positive value is entered in Samples', async () => {
      await browser.wait(ExpectedConditions.stalenessOf(pageEE.errorNegativeInteger));
      await verifyAgInvalidCellAbsentByGridGroup('ibGroup');
    });

    it('EE-TC28: Should verify if IB1 Filter and Parameter is applied correctly', async () => {
      await checkAgCellValueByGridGroup('ibGroup', 'IB1', 'filterType', 'FIR');
      await checkAgCellValueByGridGroup('ibGroup', 'IB1', 'filterParams', '5');
    });

    it('EE-TC29: Should be able to select "LoPass2ndOrder" Type on IB2', async () => {
      await waitForItemToShowAndClick(pageEE.integrationBandsStep);
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBCreate));
      const filterLoPass2ndOrderOption = cssElementContainingText(
        '.mat-option-text',
        new RegExp('^ LoPass2ndOrder $'),
      );
      await selectFilterType('ibGroup', 'IB2', 'filterType', filterLoPass2ndOrderOption);
    });

    it('EE-TC30: Should be able to enter "0.005" High CutOff Freq', async () => {
      await waitForItemToShowAndClick(pageEE.integrationBandsStep);
      await enterHighCutOffFrequency('ibGroup', 'IB2', 'filterType', '0.005');
      await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBCreate));
      await waitForItemToShowAndClick(pageEE.applyParametersIBBtn);
    });

    it('EE-TC31: Should verify if IB2 Filter and Parameter is applied correctly', async () => {
      await checkAgCellValueByGridGroup('ibGroup', 'IB2', 'filterType', 'LoPass2ndOrder');
      await checkAgCellValueByGridGroup('ibGroup', 'IB2', 'filterParams', '0.005');
    });

    it('EE-TC32: Should post error if negative value during scroll down', async () => {
      await scrollUpDownInElement(pageEE.hiCutoffFreqIB, Key.ARROW_DOWN, 5);
      await browser.wait(ExpectedConditions.presenceOf(pageEE.errorNegativeNumber));
    });

    it('EE-TC33: Should NOT post error if negative value during scroll up', async () => {
      await scrollUpDownInElement(pageEE.hiCutoffFreqIB, Key.ARROW_UP, 5);
      await browser.wait(ExpectedConditions.stalenessOf(pageEE.errorNegativeNumber));
    });

    it('EE-TC34: Should be able to click "cancel" button', async () => {
      await waitForItemToShowAndClick(pageEE.cancelParametersIBBtn);
    });

    it('EE-TC35: Should not change previously applied High CutOff Freq value', async () => {
      await checkAgCellValueByGridGroup('ibGroup', 'IB2', 'filterType', 'LoPass2ndOrder');
      await checkAgCellValueByGridGroup('ibGroup', 'IB2', 'filterParams', '0.005');
    });
  });
});
