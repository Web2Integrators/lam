/**
 * EndPointEditor e2e tests for Step 3: Algorithms
 * Requires IB1, IB2 and BF1 and BF2 loaded with default parameters and filter parameters.
 * See EE-TC66.
 */
import { browser, ExpectedConditions, Key } from 'protractor';

import * as pageRecipe from '../recipe-editor/recipe-editor.po';
import {
  discardEndPointChanges,
  enterStep1DefaultParameters,
  enterStep2DefaultParameters,
  enterStep2DefaultFilterParameters,
  selectAlgorithm,
  enterComment,
  changeNormalizationValue,
} from '../util/endpoint-functions';
import { checkBeforeClosingRecipe } from '../util/recipe-functions';
import {
  waitForItemToShowAndClick,
  waitForItemToShowWaitAndClick,
  checkAgCellValueByGridGroup,
  selectAndCheckCellValueByGridGroup,
  checkAgInvalidCellValuePresentByGridGroup,
  checkMatErrorTextByGridGroup,
  verifyMatErrorTextAbsentByGridGroup,
  scrollUpDownInElement,
} from '../util/helper-functions';
import * as pageEE from './endpoint-editor.po';
import { cssElementContainingText } from '../util/selector-functions';

describe('Endpoint Editor - Step 3', () => {
  browser.waitForAngularEnabled(false);

  beforeAll(async () => {
    console.log('== Start running s3-algorithms.e2e-specs.ts ==');
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

   // pre-requisite to start Step3 Algorithm e2e tests. Preload Step1 and Step2 parameters
  it('EE-TC66: Should load IB1 and IB2 values. BF1 and BF2 values', async () => {
    await enterStep1DefaultParameters();
    await enterStep2DefaultParameters();
    await enterStep2DefaultFilterParameters();
  });

  it('EE-TC67: Should be able to select Algorithms page', async () => {
    await waitForItemToShowAndClick(pageEE.algorithmsStep);
  });

  it('EE-TC68: Should show "Done" icon on IB and BF step', async () => {
    await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBDone));
    await browser.wait(ExpectedConditions.presenceOf(pageEE.iconBasicFunctionsDone));
  });

  it('EE-TC69: Should show "Create" icon on Algorithms step', async () => {
    await browser.wait(ExpectedConditions.presenceOf(pageEE.iconAlgorithmsCreate));
  });

  it('EE-TC70: Should be able to select Stage Execution mode "Sequentially"', async () => {
    await waitForItemToShowAndClick(pageEE.sequentialRadioBtn);
  });

  it('EE-TC71: Should validate "Stage" rows on first column for "Sequentially" mode', async () => {
    /**
     * Need to use double quote for row-id that has space in between.
     * Example: '"Stage 1"' instead of 'Stage 1'. Using the latter will post invalid selector error.
     */
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 1"', 'stage', 'Stage 1');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 2"', 'stage', 'Stage 2');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 3"', 'stage', 'Stage 3');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 4"', 'stage', 'Stage 4');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 5"', 'stage', 'Stage 5');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 6"', 'stage', 'Stage 6');
  });

  it('EE-TC72: Should be able to select Stage Execution mode "Parallel OR"', async () => {
    await waitForItemToShowAndClick(pageEE.parallelORRadioBtn);
  });

  it('EE-TC73: Should validate "EP" rows on first column for "Parallel OR" mode', async () => {
    /**
     * Need to use double quote for row-id that has space in between.
     * Example: '"EP 1"' instead of 'EP 1'. Using the latter will post invalid selector error.
     */
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 1"', 'ep', 'EP 1');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 2"', 'ep', 'EP 2');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 3"', 'ep', 'EP 3');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 4"', 'ep', 'EP 4');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 5"', 'ep', 'EP 5');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 6"', 'ep', 'EP 6');
  });

  it('EE-TC74: Should be able to select Stage Execution mode "Parallel AND"', async () => {
    await waitForItemToShowAndClick(pageEE.parallelANDRadioBtn);
  });

  it('EE-TC75: Should validate "EP" rows on first column for "Parallel AND" mode', async () => {
    /**
     * Need to use double quote for row-id that has space in between.
     * Example: '"EP 1"' instead of 'EP 1'. Using the latter will post invalid selector error.
     */
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 1"', 'ep', 'EP 1');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 2"', 'ep', 'EP 2');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 3"', 'ep', 'EP 3');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 4"', 'ep', 'EP 4');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 5"', 'ep', 'EP 5');
    await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 6"', 'ep', 'EP 6');
  });

  it('EE-TC76: Should be able to change Stage 1 Basic Function to "BF1"', async () => {
    await waitForItemToShowAndClick(pageEE.sequentialRadioBtn);
    await selectAndCheckCellValueByGridGroup('algorithmsGroup', '"Stage 1"', 'bf', 'BF4');
    await selectAndCheckCellValueByGridGroup('algorithmsGroup', '"Stage 1"', 'bf', 'BF1');
  });

  it('EE-TC77: Should be able to change Stage 2 Basic Function to "BF2"', async () => {
    await selectAndCheckCellValueByGridGroup('algorithmsGroup', '"Stage 2"', 'bf', 'BF2');
  });

  it('EE-TC78: Should show underline error "A value is required" on Algorithm col', async () => {
    await checkAgInvalidCellValuePresentByGridGroup(
      'algorithmsGroup', 'title', 'A value is required');
  });

  it('EE-TC79: Should show error "Please chose an algorithm" on Algorithm parameter', async () => {
    await checkMatErrorTextByGridGroup('algorithmParameters', 'Please choose an algorithm');
  });

  it('EE-TC80: Should be able to change Stage 1 Algorithm to "PercentSlope"', async () => {
     const algorithmPercentSlopeOption = cssElementContainingText(
      '.mat-option-text',
      new RegExp('^PercentSlope$'),
    );
     await selectAlgorithm(
       'algorithmsGroup', '"Stage 1"', 'algorithm', algorithmPercentSlopeOption);
  });

  it('EE-TC81: Should be able to click "Apply" on Alrogithm Stage 1', async () => {
    await waitForItemToShowAndClick(pageEE.applyParametersAlgothmBtn);
  });

  it('EE-TC82: Should validate Algorithm "PercentSlope" is selected  on Stage 1', async () => {
    await checkAgCellValueByGridGroup(
      'algorithmsGroup', '"Stage 1"', 'algorithm', 'PercentSlope');
  });

  it('EE-TC83: Should validate default Algorithm Parameters values on Stage 1', async () => {
    await checkAgCellValueByGridGroup(
      'algorithmsGroup',
      '"Stage 1"',
      'parameters',
      '0.0000; 0.1000; 0.0000; 0.0000; 0.0000; Up; [];'
    );
  });

  it('EE-TC84: Should be able to change Stage 2 Algorithm to "ValueChange"', async () => {
    const algorithmValueChangeOption = cssElementContainingText(
      '.mat-option-text',
      new RegExp('^ValueChange$'),
    );
    await selectAlgorithm(
       'algorithmsGroup', '"Stage 2"', 'algorithm', algorithmValueChangeOption);
  });

  it('EE-TC85: Should be able to click "Apply" on Alrogithm Stage 2', async () => {
    await waitForItemToShowAndClick(pageEE.applyParametersAlgothmBtn);
  });

  it('EE-TC86: Should validate Algorithm "ValueChange" is selected on Stage 2 ', async () => {
    await checkAgCellValueByGridGroup(
      'algorithmsGroup', '"Stage 2"', 'algorithm', 'ValueChange');
  });

  it('EE-TC87: Should validate default Algorithm Parameters values on Stage 2', async () => {
    await checkAgCellValueByGridGroup(
      'algorithmsGroup',
      '"Stage 2"',
      'parameters',
      '0.0000; 0.1000; 0.0000; [];'
    );
  });

  it('EE-TC88: Should be able to add Comment "Test" on Stage 2', async () => {
    await enterComment('algorithmsGroup', '"Stage 2"', 'algorithm', 'Test');
  });

  it('EE-TC89: Should be able to click "Apply" on Alrogithm Stage 2', async () => {
    await waitForItemToShowAndClick(pageEE.applyParametersAlgothmBtn);
  });

  it('EE-TC90: Should validate Algorithm comment on Stage 2', async () => {
    await checkAgCellValueByGridGroup(
      'algorithmsGroup',
      '"Stage 2"',
      'parameters',
      '0.0000; 0.1000; 0.0000; [Test];'
    );
  });

  it('EE-TC91: Should be able to change "Normalization Time" to "-1" on Stage 2', async () => {
    await changeNormalizationValue('algorithmsGroup', '"Stage 2"', 'algorithm', '-1');
  });

  it('EE-TC92: Should show error "Must be greater than 0"', async () => {
    await checkMatErrorTextByGridGroup('algorithmParameters', 'Must be greater than 0');
  });

  it('EE-TC93: Should be able to change "Normalization Time" to "0" on Stage 2', async () => {
    await changeNormalizationValue('algorithmsGroup', '"Stage 2"', 'algorithm', '0');
  });

  it('EE-TC94: Should show error "Must be greater than 0"', async () => {
    await checkMatErrorTextByGridGroup('algorithmParameters', 'Must be greater than 0');
  });

  it('EE-TC95: Should be able to click "Apply" on Alrogithm Stage 2', async () => {
    await waitForItemToShowAndClick(pageEE.applyParametersAlgothmBtn);
  });

  it('EE-TC96: Should validate Algorithm comment on Stage 2', async () => {
    await checkAgCellValueByGridGroup(
      'algorithmsGroup',
      '"Stage 2"',
      'parameters',
      '0.0000; 0.0000; 0.0000; [Test];'
    );
  });

  it('EE-TC97: Should be able to change "Normalization Time" to "2" on Stage 2', async () => {
    await scrollUpDownInElement(pageEE.normalizationTimeAlgorithm, Key.ARROW_UP, 2);
  });

  it('EE-TC98: Should not show error "Must be greater than 0"', async () => {
    await verifyMatErrorTextAbsentByGridGroup('algorithmParameters');
  });

  it('EE-TC99: Should be able to click "Apply" on Alrogithm Stage 2', async () => {
    await waitForItemToShowAndClick(pageEE.applyParametersAlgothmBtn);
  });

  it('EE-TC100: Should validate modified "Normalization Time" value  on Stage 2', async () => {
    await checkAgCellValueByGridGroup(
      'algorithmsGroup',
      '"Stage 2"',
      'parameters',
      '0.0000; 2.0000; 0.0000; [Test];'
    );
  });

  it('EE-TC101: Should be able to change "Normalization Time" to "-6" on Stage 2', async () => {
    await changeNormalizationValue('algorithmsGroup', '"Stage 2"', 'algorithm', '-6');
  });

  it('EE-TC102: Should show error "Must be greater than 0"', async () => {
    await checkMatErrorTextByGridGroup('algorithmParameters', 'Must be greater than 0');
  });

  it('EE-TC103: Should be able to click "Cancel"', async () => {
    await waitForItemToShowAndClick(pageEE.cancelParametersAlgthmBtn);
  });

  it('EE-TC104: Should validate unchanged Algorithm Parameters values on Stage 2', async () => {
    await checkAgCellValueByGridGroup(
      'algorithmsGroup',
      '"Stage 2"',
      'parameters',
      '0.0000; 2.0000; 0.0000; [Test]'
    );
  });

  it('EE-TC105: Should validate unchanged Algorithm Parameters in "Parallel OR" model',
     async () => {
        await waitForItemToShowAndClick(pageEE.parallelORRadioBtn);

        // Check Stage 1 algorithm parameters
        await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 1"', 'ep', 'EP 1');
        await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 1"', 'bf', 'BF1');
        await checkAgCellValueByGridGroup(
          'algorithmsGroup', '"Stage 1"', 'algorithm', 'PercentSlope');
        await checkAgCellValueByGridGroup(
          'algorithmsGroup',
          '"Stage 1"',
          'parameters',
          '0.0000; 0.1000; 0.0000; 0.0000; 0.0000; Up; [];'
        );

        // Check Stage 2 algorithm parameters
        await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 2"', 'ep', 'EP 2');
        await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 2"', 'bf', 'BF2');
        await checkAgCellValueByGridGroup(
          'algorithmsGroup', '"Stage 2"', 'algorithm', 'ValueChange');
        await checkAgCellValueByGridGroup(
          'algorithmsGroup',
          '"Stage 2"',
          'parameters',
          '0.0000; 2.0000; 0.0000; [Test]'
        );
  });

  it('EE-TC106: Should validate unchanged Algorithm Parameters in "Parallel AND" model',
     async () => {
        await waitForItemToShowAndClick(pageEE.parallelANDRadioBtn);

        // Check Stage 1 algorithm parameters
        await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 1"', 'ep', 'EP 1');
        await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 1"', 'bf', 'BF1');
        await checkAgCellValueByGridGroup(
          'algorithmsGroup', '"Stage 1"', 'algorithm', 'PercentSlope');
        await checkAgCellValueByGridGroup(
          'algorithmsGroup',
          '"Stage 1"',
          'parameters',
          '0.0000; 0.1000; 0.0000; 0.0000; 0.0000; Up; [];'
        );

        // Check Stage 2 algorithm parameters
        await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 2"', 'ep', 'EP 2');
        await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 2"', 'bf', 'BF2');
        await checkAgCellValueByGridGroup(
          'algorithmsGroup', '"Stage 2"', 'algorithm', 'ValueChange');
        await checkAgCellValueByGridGroup(
          'algorithmsGroup',
          '"Stage 2"',
          'parameters',
          '0.0000; 2.0000; 0.0000; [Test]'
        );
  });

  it('EE-TC107: Should validate unchanged Algorithm Parameters in "Sequentially" model',
     async () => {
        await waitForItemToShowAndClick(pageEE.sequentialRadioBtn);

        // Check Stage 1 algorithm parameters
        await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 1"', 'stage', 'Stage 1');
        await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 1"', 'bf', 'BF1');
        await checkAgCellValueByGridGroup(
          'algorithmsGroup', '"Stage 1"', 'algorithm', 'PercentSlope');
        await checkAgCellValueByGridGroup(
          'algorithmsGroup',
          '"Stage 1"',
          'parameters',
          '0.0000; 0.1000; 0.0000; 0.0000; 0.0000; Up; [];'
        );

        // Check Stage 2 algorithm parameters
        await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 2"', 'stage', 'Stage 2');
        await checkAgCellValueByGridGroup('algorithmsGroup', '"Stage 2"', 'bf', 'BF2');
        await checkAgCellValueByGridGroup(
          'algorithmsGroup', '"Stage 2"', 'algorithm', 'ValueChange');
        await checkAgCellValueByGridGroup(
          'algorithmsGroup',
          '"Stage 2"',
          'parameters',
          '0.0000; 2.0000; 0.0000; [Test]'
        );
  });
});
