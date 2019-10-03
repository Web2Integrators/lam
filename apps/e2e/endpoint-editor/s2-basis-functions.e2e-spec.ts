/**
 * EndPointEditor e2e tests for Step 2: Basic functions (BFs)
 * Requires IB1, IB2 and BF1 and BF2 loaded with default parameters. See EE-TC36 and EE-TC37.
 */
import { browser, ExpectedConditions, Key } from 'protractor';

import * as pageRecipe from '../recipe-editor/recipe-editor.po';
import {
  discardEndPointChanges,
  enterStep1DefaultParameters,
  enterStep2DefaultParameters,
  enterAndCheckBFCellValue,
  selectFilterType,
  enterHighCutOffFrequency,
  enterLowCutOffFrequency,
} from '../util/endpoint-functions';
import { checkBeforeClosingRecipe } from '../util/recipe-functions';
import {
  waitForItemToShowAndClick,
  waitForItemToShowWaitAndClick,
  waitForLongOperation,
  checkAgCellValueByGridGroup,
  scrollUpDownInElement,
  checkAgInvalidCellValuePresentByGridGroup,
  verifyAgInvalidCellAbsentByGridGroup,
} from '../util/helper-functions';
import * as pageEE from './endpoint-editor.po';
import { cssElementContainingText } from '../util/selector-functions';

describe('Endpoint Editor - Step 2', () => {
  browser.waitForAngularEnabled(false);

  beforeAll(async () => {
    console.log('== Start running s2-basis-functions.e2e-spec.ts ==');
    await browser.get(`/devMode?resource=${browser.params.resource}`);

    // Create new recipe
    await waitForItemToShowAndClick(pageRecipe.createRecipeBtn);
    await browser.wait(ExpectedConditions.presenceOf(pageRecipe.selectedRecipeName));

    // Open EndPoint Editor from Step1
    await waitForItemToShowWaitAndClick(pageRecipe.headerMenuBtn1);
    await waitForItemToShowWaitAndClick(pageRecipe.openEpEditor);
  });

  afterAll(async () => {
    // check and close existing recipe and return to Create/Open Recipe menu.
    await discardEndPointChanges();
    await checkBeforeClosingRecipe();
  });

  // pre-requisite to start Step2 BF e2e tests. Preload IB1 and IB2 values
  it('EE-TC36: Should load IB1 and IB2 values', async () => {
    await enterStep1DefaultParameters();
  });

  // pre-requisite to start Step2 BF e2e tests on. Preload BF1 and BF2 values
  it('EE-TC37: Should load BF1 and BF2', async () => {
    await enterStep2DefaultParameters();
  });

  it('EE-TC38: Should not post error for equation "IB1 + IB2" on BF1', async () => {
    await enterAndCheckBFCellValue('BF1', 'equation', 'IB1+IB2');
  });

  it('EE-TC39: Should not post error for "IB1 - IB2" on BF1', async () => {
    await enterAndCheckBFCellValue('BF1', 'equation', 'IB1-IB2');
  });

  it('EE-TC40: Should not post error for "IB1 * IB2" on BF1', async () => {
    await enterAndCheckBFCellValue('BF1', 'equation', 'IB1*IB2');
  });

  it('EE-TC41: Should not post error for "IB1**2" on BF1', async () => {
    await enterAndCheckBFCellValue('BF1', 'equation', 'IB1**2');
  });

  it('EE-TC42: Should not post error for "IB1/IB2" on BF1', async () => {
    await enterAndCheckBFCellValue('BF1', 'equation', 'IB1/IB2');
  });

  it('EE-TC43: Should not post error for "Slope(IB1)" on BF1', async () => {
    await enterAndCheckBFCellValue('BF1', 'equation', 'Slope(IB1)');
  });

  it('EE-TC44: Should not post error for "Slope(IB1/IB2)" on BF1', async () => {
    await enterAndCheckBFCellValue('BF1', 'equation', 'Slope(IB1/IB2)');
  });

  it('EE-TC45: Should not post error for "DSlope(IB1)" on BF1', async () => {
    await enterAndCheckBFCellValue('BF1', 'equation', 'DSlope(IB1)');
  });

  it('EE-TC46: Should not post error for "DSlope(IB1 + IB2)" on BF1', async () => {
    await enterAndCheckBFCellValue('BF1', 'equation', 'DSlope(IB1+IB2)');
  });

  it('EE-TC47: Should not post error for "DSlope(IB1 - IB2)" on BF1', async () => {
    await enterAndCheckBFCellValue('BF1', 'equation', 'DSlope(IB1-IB2)');
  });

  it('EE-TC48: Should not post error for "DSlope(IB2 - IB2)" on BF1', async () => {
    await enterAndCheckBFCellValue('BF1', 'equation', 'DSlope(IB2-IB2)');
  });

  it('EE-TC49: Should post error if IB3 is entered on BF2', async () => {
    await enterAndCheckBFCellValue('BF2', 'equation', 'IB3');
    await checkAgInvalidCellValuePresentByGridGroup('bfGroup', 'title', 'IB3 is undefined');
    await waitForLongOperation();
    await enterAndCheckBFCellValue('BF2', 'equation', 'IB2');
  });

  it('EE-TC50: Should be able to enter "LoPass1stOrder" and High "0.00001" on BF1', async () => {
    const filterLoPass1stOrderOption = cssElementContainingText(
      '.mat-option-text',
      new RegExp('^ LoPass1stOrder $'),
    );
    await selectFilterType('bfGroup', 'BF1', 'filterType', filterLoPass1stOrderOption);
    await enterHighCutOffFrequency('bfGroup', 'BF1', 'filterType', '0.00001');
  });

  it('EE-TC51: Should be able to click "Apply"', async () => {
    await waitForItemToShowAndClick(pageEE.applyParametersBFBtn);
  });

  it('EE-TC52: Should validate Filter and Parameter on BF1', async () => {
    await checkAgCellValueByGridGroup('bfGroup', 'BF1', 'filterType', 'LoPass1stOrder');
    await checkAgCellValueByGridGroup('bfGroup', 'BF1', 'filterParams', '0.00001');
  });

  it('EE-TC53: Should be able to scroll HighCutOff Freq to negative value "-3"', async () => {
    await scrollUpDownInElement(pageEE.hiCutoffFreqBF, Key.ARROW_DOWN, 4);
    await browser.wait(ExpectedConditions.presenceOf(pageEE.errorNegativeNumber));
  });

  it('EE-TC54: Should be able to click "Apply"', async () => {
    await waitForItemToShowAndClick(pageEE.applyParametersBFBtn);
  });

  it('EE-TC55: Should post error "Must be a nonnegative number"', async () => {
    await checkAgCellValueByGridGroup('bfGroup', 'BF1', 'filterParams', '-3');
  });

  it('EE-TC56: Should post underline red error', async () => {
    await checkAgInvalidCellValuePresentByGridGroup(
      'bfGroup', 'title', 'Parameter hiCutoffFreq is invalid');
  });

  it('EE-TC57: Should be able to enter "0.005" on BF1 High CutOff Freq', async () => {
    await enterHighCutOffFrequency('bfGroup', 'BF1', 'filterType', '0.005');
  });

  it('EE-TC58: Should be able to click "Apply"', async () => {
    await waitForItemToShowAndClick(pageEE.applyParametersBFBtn);
  });

  it('EE-TC59: Should not post any errors', async () => {
    await browser.wait(ExpectedConditions.stalenessOf(pageEE.errorNegativeInteger));
    await verifyAgInvalidCellAbsentByGridGroup('bfGroup');
  });

  it('EE-TC60: Should be able to enter "Band2ndOrder" on BF1', async () => {
    const filterBand2ndOrderOption = cssElementContainingText(
      '.mat-option-text',
      new RegExp('^ Band2ndOrder $'),
    );
    await selectFilterType('bfGroup', 'BF1', 'filterType', filterBand2ndOrderOption);
  });

  it('EE-TC61: Should be able to click "Cancel"', async () => {
    await waitForLongOperation(); // need to add this wait. If not, button is not visible.
    await waitForItemToShowAndClick(pageEE.cancelParametersBFBtn);
  });

  it('EE-TC62: Should validate unchanged values of Filter and Parameter on BF1', async () => {
    await checkAgCellValueByGridGroup('bfGroup', 'BF1', 'filterType', 'LoPass1stOrder');
    await checkAgCellValueByGridGroup('bfGroup', 'BF1', 'filterParams', '0.005');
  });

  it('EE-TC63: Should be able to enter "Band2ndOrder" and High/Low "0.00001" on BF2', async () => {
    const filterBand2ndOrderOption = cssElementContainingText(
      '.mat-option-text',
      new RegExp('^ Band2ndOrder $'),
    );
    await selectFilterType('bfGroup', 'BF2', 'filterType', filterBand2ndOrderOption);
    await enterHighCutOffFrequency('bfGroup', 'BF2', 'filterType', '0.00001');
    await enterLowCutOffFrequency('bfGroup', 'BF2', 'filterType', '0.00001');
  });

  it('EE-TC64: Should be able to click "Apply"', async () => {
    await waitForLongOperation(); // need to add this wait. If not, button is not visible.
    await waitForItemToShowAndClick(pageEE.applyParametersBFBtn);
  });

  it('EE-TC65: Should validate Filter and Parameter on BF2', async () => {
    await checkAgCellValueByGridGroup('bfGroup', 'BF2', 'filterType', 'Band2ndOrder');
    await checkAgCellValueByGridGroup('bfGroup', 'BF2', 'filterParams', '0.00001, 0.00001');
  });
});
