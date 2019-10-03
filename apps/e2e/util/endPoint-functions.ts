import { browser, ExpectedConditions, Key, ElementFinder } from 'protractor';

import * as pageEE from '../endpoint-editor/endpoint-editor.po';
import * as pageRecipe from '../recipe-editor/recipe-editor.po';
import {
  waitForItemToShowAndClick,
  waitForLongOperation,
  enterAndCheckCellValueByGridGroup,
  checkMatCardTextByGridGroup,
} from './helper-functions';
import { getAgCellbyAgGroup, cssElementContainingText, } from './selector-functions';

/**
 * Endpoint Editor: Discard change and return to recipe.
 */
export async function discardEndPointChanges() {
  await browser.sleep(1000);
  await waitForItemToShowAndClick(pageEE.discardChangesBtn);
  await browser.wait(ExpectedConditions.presenceOf(pageRecipe.selectedRecipeName));
}

/**
 * Change the value of a cell in the EE BF Cell values accept the contents
 * and check and the value is equals to the entered one.
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The number of the column in the grid (starts at 1)
 * @param {string} value The input value that should be added.
 */
export async function enterAndCheckBFCellValue(rowName: string, colName: string, value: string) {
  await enterBFCellValue(rowName, colName, value);
  await waitForLongOperation();
  await checkBFCellValue(rowName, colName, value);
}

/**
 * Change the value of a cell in the recipe editor, accept the contents.
 * Used for text fields
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The number of the column in the grid (starts at 1)
 * @param {string} value The input value that should be added.
 */
export async function enterBFCellValue(rowName: string, colName: string, value: string) {
  const cell = getAgCellbyAgGroup('bfGroup', rowName, colName);
  await waitForItemToShowAndClick(cell);
  await browser
    .actions()
    .sendKeys(Key.ENTER)
    .perform(); // replace the double click
  await browser.wait(ExpectedConditions.presenceOf(pageEE.agBFInput));
  await pageEE.agBFInput.sendKeys(value);
  await browser.wait(ExpectedConditions.presenceOf(pageEE.hintOk));
  await browser
    .actions()
    .sendKeys(Key.ENTER)
    .perform();
  await browser.wait(ExpectedConditions.presenceOf(cell));
  await browser.wait(ExpectedConditions.elementToBeClickable(cell));
}

/**
 * Change the value of a cell in the recipe editor, accept the contents.
 * Used for text fields
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The number of the column in the grid (starts at 1)
 * @param {string} value The input value that should be added.
 */
export async function checkBFCellValue(rowName: string, colName: string, value: string) {
  const cell = getAgCellbyAgGroup('bfGroup', rowName, colName);
  expect(await cell.getText()).toContain(value);
}

/**
 * Change IB Parameter - Signal Channel
 * Used for text fields
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The number of the column in the grid (starts at 1)
 * @param {ElementFinder} item The element from the drop down list.
 */
export async function selectIBSignalChannel(rowName: string, colName: string, item: ElementFinder) {
  const cell = getAgCellbyAgGroup('ibGroup', rowName, colName);
  const paramIB = 'Parameters-' + rowName;
  await waitForItemToShowAndClick(cell);
  await browser.wait(ExpectedConditions.presenceOf(pageEE.filterIBParameters));
  await browser.wait(
    ExpectedConditions.textToBePresentInElement(pageEE.filterIBParameters, paramIB),
    2000,
  );
  await waitForItemToShowAndClick(pageEE.signalChannelFilterList);
  await waitForItemToShowAndClick(item);
  await browser
    .actions()
    .sendKeys(Key.ESCAPE)
    .perform();
}

/**
 * Select Filter Type by 'IB Group (Step 1)' or 'BF Group (Step 2)'
 * Used for text fields
 * @param {string} parameterGroup e2e tag of parameter Group
 * @param {string} rowName The name of the row in the grid
 * @param {number} colName The number of the column in the grid (starts at 1)
 * @param {ElementFinder} item The element from the drop down list.
 */
export async function selectFilterType(
  parameterGroup: string,
  rowName: string,
  colName: string,
  item: ElementFinder,
) {
  const cell = getAgCellbyAgGroup(parameterGroup, rowName, colName);
  await waitForItemToShowAndClick(cell);

  if (parameterGroup === 'bfGroup') {
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        pageEE.filterBFParameters,
        'Filter Parameters-' + rowName,
      ),
      2000,
    );
    await waitForItemToShowAndClick(pageEE.filterTypeBF);
  } else {
    // parameterGroup === 'ibGroup'
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        pageEE.filterIBParameters,
        'Parameters-' + rowName,
      ),
      2000,
    );
    await waitForItemToShowAndClick(pageEE.filterTypeIB);
  }

  await waitForItemToShowAndClick(item);
  await browser
    .actions()
    .sendKeys(Key.ESCAPE)
    .perform();
}

/**
 * Change IB or BF Parameter - coefficients
 * Used for text fields
 * @param {string} parameterGroup e2e tag of parameter Group
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The number of the column in the grid (starts at 1)
 * @param {string} sample The element from the drop down list.
 */
export async function enterSamples(
  parameterGroup: string,
  rowName: string,
  colName: string,
  sample: string,
) {
  const cell = getAgCellbyAgGroup(parameterGroup, rowName, colName);
  await waitForItemToShowAndClick(cell);

  if (parameterGroup === 'bfGroup') {
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        pageEE.filterBFParameters,
        'Filter Parameters-' + rowName,
      ),
      2000,
    );
    await waitForItemToShowAndClick(pageEE.numSamplesBF);
    await pageEE.numSamplesBF.clear();
    await waitForItemToShowAndClick(pageEE.numSamplesBF);
  } else {
    // parameterGroup === 'ibGroup'
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        pageEE.filterIBParameters,
        'Parameters-' + rowName,
      ),
      2000,
    );
    await waitForItemToShowAndClick(pageEE.numSamplesIB);
    await pageEE.numSamplesIB.clear();
    await waitForItemToShowAndClick(pageEE.numSamplesIB);
  }

  await browser
    .actions()
    .sendKeys(sample)
    .perform();
}

/**
 * Change IB or BF Parameter - High Cutoff Frequency
 * Used for text fields
 * @param {string} parameterGroup e2e tag of parameter Group
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The number of the column in the grid (starts at 1)
 * @param {string} sample The element from the drop down list.
 */
export async function enterHighCutOffFrequency(
  parameterGroup: string,
  rowName: string,
  colName: string,
  sample: string,
) {
  const cell = getAgCellbyAgGroup(parameterGroup, rowName, colName);
  await waitForItemToShowAndClick(cell);

  if (parameterGroup === 'bfGroup') {
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        pageEE.filterBFParameters,
        'Filter Parameters-' + rowName,
      ),
      2000,
    );
    await waitForItemToShowAndClick(pageEE.hiCutoffFreqBF);
    await pageEE.hiCutoffFreqBF.clear();
    await waitForItemToShowAndClick(pageEE.hiCutoffFreqBF);
  } else {
    // parameterGroup === 'ibGroup'
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        pageEE.filterIBParameters,
        'Parameters-' + rowName,
      ),
      2000,
    );
    await waitForItemToShowAndClick(pageEE.hiCutoffFreqIB);
    await pageEE.hiCutoffFreqIB.clear();
    await waitForItemToShowAndClick(pageEE.hiCutoffFreqIB);
  }

  await browser
    .actions()
    .sendKeys(sample)
    .perform();
}

/**
 * Change IB or BF Parameter - Low Cutoff Frequency
 * Used for text fields
 * @param {string} parameterGroup e2e tag of parameter Group
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The number of the column in the grid (starts at 1)
 * @param {string} sample The element from the drop down list.
 */
export async function enterLowCutOffFrequency(
  parameterGroup: string,
  rowName: string,
  colName: string,
  sample: string,
) {
  const cell = getAgCellbyAgGroup(parameterGroup, rowName, colName);
  await waitForItemToShowAndClick(cell);

  if (parameterGroup === 'bfGroup') {
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        pageEE.filterBFParameters,
        'Filter Parameters-' + rowName,
      ),
      2000,
    );
    await waitForItemToShowAndClick(pageEE.loCurOffFreqBF);
    await pageEE.loCurOffFreqBF.clear();
    await waitForItemToShowAndClick(pageEE.loCurOffFreqBF);
  } else {
    // parameterGroup === 'ibGroup'
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        pageEE.filterIBParameters,
        'Parameters-' + rowName,
      ),
      2000,
    );
    await waitForItemToShowAndClick(pageEE.loCurOffFreqIB);
    await pageEE.loCurOffFreqIB.clear();
    await waitForItemToShowAndClick(pageEE.loCurOffFreqIB);
  }
  await browser
    .actions()
    .sendKeys(sample)
    .perform();
}

/**
 * Select Algorithm in Algorithms parameter Group
 * Used for text fields
 * @param {string} parameterGroup e2e tag of parameter Group
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The number of the column in the grid (starts at 1)
 * @param {ElementFinder} item The element from the drop down list.
 */
export async function selectAlgorithm(
  parameterGroup: string,
  rowName: string,
  colName: string,
  item: ElementFinder,
) {
  const cell = getAgCellbyAgGroup(parameterGroup, rowName, colName);
  await waitForItemToShowAndClick(cell);

  if (parameterGroup === 'algorithmsGroup') {
    const labelName = rowName.substr(1).slice(0, -1);
    await checkMatCardTextByGridGroup('algorithmParameters', 'Algorithm-' + labelName);
  }
  await waitForItemToShowAndClick(pageEE.algorithmList);
  await waitForItemToShowAndClick(item);
  await browser
    .actions()
    .sendKeys(Key.ESCAPE)
    .perform();
}

/**
 * Enter Comment in a parameter Group
 * Used for text fields
 * @param {string} parameterGroup e2e tag of parameter Group
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The number of the column in the grid (starts at 1)
 * @param {string} commentString The element from the drop down list.
 */
export async function enterComment(
  parameterGroup: string,
  rowName: string,
  colName: string,
  commentString: string,
) {
  const cell = getAgCellbyAgGroup(parameterGroup, rowName, colName);
  await waitForItemToShowAndClick(cell);

  if (parameterGroup === 'algorithmsGroup') {
    const labelName = rowName.substr(1).slice(0, -1);
    await checkMatCardTextByGridGroup('algorithmParameters', 'Algorithm-' + labelName);
  }

  await waitForItemToShowAndClick(pageEE.commentAlgorithm);
  await pageEE.commentAlgorithm.clear();
  await waitForItemToShowAndClick(pageEE.commentAlgorithm);
  await browser
    .actions()
    .sendKeys(commentString)
    .perform();
}

/**
 * Change Normalization Time in Algorithms parameter Group
 * Used for text fields
 * @param {string} parameterGroup e2e tag of parameter Group
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The number of the column in the grid (starts at 1)
 * @param {string} value The element from the drop down list.
 */
export async function changeNormalizationValue(
  parameterGroup: string,
  rowName: string,
  colName: string,
  value: string,
) {
  const cell = getAgCellbyAgGroup(parameterGroup, rowName, colName);
  await waitForItemToShowAndClick(cell);

  if (parameterGroup === 'algorithmsGroup') {
    const labelName = rowName.substr(1).slice(0, -1); // remove char "" for label string check.
    await checkMatCardTextByGridGroup('algorithmParameters', 'Algorithm-' + labelName);
  }

  await waitForItemToShowAndClick(pageEE.normalizationTimeAlgorithm);
  await pageEE.normalizationTimeAlgorithm.clear();
  await waitForItemToShowAndClick(pageEE.normalizationTimeAlgorithm);
  await browser
    .actions()
    .sendKeys(value)
    .perform();
}

/**
 * Enter default EE Step 1 - IB parameters
 * IB1 (Wavelength: 250, Filter: FIR, Parameters 5)
 * IB2 (Wavelength: 500, Filter: LoPass2ndOrder, Parameters: 0.005)
 */
export async function enterStep1DefaultParameters() {
  await waitForItemToShowAndClick(pageEE.integrationBandsStep);
  await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBCreate));

  // enter IB1 parameters
  await enterAndCheckCellValueByGridGroup('ibGroup', 'IB1', 'wavelength', '250');
  const filterFIROption = cssElementContainingText('.mat-option-text', new RegExp('^ FIR $'));
  await selectFilterType('ibGroup', 'IB1', 'filterType', filterFIROption);
  await enterSamples('ibGroup', 'IB1', 'filterType', '5');

  // select Apply
  await waitForItemToShowAndClick(pageEE.applyParametersIBBtn);

  // enter IB2 parameters
  await enterAndCheckCellValueByGridGroup('ibGroup', 'IB2', 'wavelength', '500');
  const filterLoPass2ndOrderOption = cssElementContainingText(
    '.mat-option-text',
    new RegExp('^ LoPass2ndOrder $'),
  );
  await selectFilterType('ibGroup', 'IB2', 'filterType', filterLoPass2ndOrderOption);
  await enterHighCutOffFrequency('ibGroup', 'IB2', 'filterType', '0.005');

  // select Apply
  await waitForItemToShowAndClick(pageEE.applyParametersIBBtn);
}

/**
 * Enter default EE Step 2 - BF parameters:
 * BF1 (Basis Function Equation: IB1)
 * BF2 (Basis Function Equation: IB2)
 */
export async function enterStep2DefaultParameters() {
  await browser.wait(ExpectedConditions.presenceOf(pageEE.iconIBCreate));
  await waitForItemToShowAndClick(pageEE.basisFunctionStep);
  await browser.wait(ExpectedConditions.presenceOf(pageEE.iconBasicFunctionsCreate));

  // enter BF1
  await enterAndCheckBFCellValue('BF1', 'equation', 'IB1');

  // enter BF2
  await enterAndCheckBFCellValue('BF2', 'equation', 'IB2');
}

/**
 * Enter default EE Step 2 - BF Filter parameters:
 * BF1 (IB1, Filter: LoPass1stOrder, High CutOff Freq: 0.005)
 * BF2 (IB2, Filter: Band2nd Order, High CutOff Freq: 0.00001,  LowCutOff Freq: 0.00001)
 */
export async function enterStep2DefaultFilterParameters() {
  await browser.wait(ExpectedConditions.presenceOf(pageEE.iconBasicFunctionsCreate));

  // enter BF1 Filter Parameters
  await enterAndCheckBFCellValue('BF1', 'equation', 'IB1');
  const filterLoPass1stOrderOption = cssElementContainingText(
    '.mat-option-text',
    new RegExp('^ LoPass1stOrder $'),
  );
  await selectFilterType('bfGroup', 'BF1', 'filterType', filterLoPass1stOrderOption);
  await enterHighCutOffFrequency('bfGroup', 'BF1', 'filterType', '0.00001');
  await waitForItemToShowAndClick(pageEE.applyParametersBFBtn);

  // enter BF2 Filter Parameters
  const filterBand2ndOrderOption = cssElementContainingText(
    '.mat-option-text',
    new RegExp('^ Band2ndOrder $'),
  );
  await selectFilterType('bfGroup', 'BF2', 'filterType', filterBand2ndOrderOption);
  await enterHighCutOffFrequency('bfGroup', 'BF2', 'filterType', '0.00001');
  await enterLowCutOffFrequency('bfGroup', 'BF2', 'filterType', '0.00001');
  await waitForItemToShowAndClick(pageEE.applyParametersBFBtn);
}
