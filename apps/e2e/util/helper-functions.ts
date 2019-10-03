import { browser, ExpectedConditions, ElementFinder, Key } from 'protractor';

import * as arbitrationPage from '../arbitration/arbitration.po';
import * as recipePage from '../recipe-editor/recipe-editor.po';
import { openProcessRecipe } from './recipe-functions';
import {
  getAgCell,
  getAgCellEditInputOption,
  getAgCellbyAgGroup,
  getAgInvalidCellbyAgGroup,
  getMatErrorElementbyAgGroup,
  getMatCardElementbyAgGroup
} from './selector-functions';

export async function waitForLongOperation() {
  await browser.sleep(2000); // Spinner comes after 1 second
  await browser.wait(ExpectedConditions.invisibilityOf(arbitrationPage.waitingVisual));
  await browser.wait(ExpectedConditions.invisibilityOf(recipePage.waitingVisual));
}

/*
 * Dev mode login vs fastLogin
 */
export async function login() {
  if (browser.params.bypassLogin) {
    await browser.get(`${browser.params.baseHref}/devMode?resource=${browser.params.resource}`);
  } else {
    await fastLogin();
  }
}

/**
 * Login with a reicpe name and open the predefined recipe.
 * @param {string} recipeName The recipe name.
 */
export async function loginWithRecipe(recipeName: string) {
  await browser.waitForAngularEnabled(false);
  await login();
  await openProcessRecipe(recipeName);
}

/*
 * Connect to the PDE straightforwardly
 */
export async function fastLogin() {
  await browser.get('/');
  await arbitrationPage.toolIdInput.clear();
  await arbitrationPage.toolIdInput.sendKeys(browser.params.validToolAddress);
  await arbitrationPage.connectBtn.click();
  await browser.wait(ExpectedConditions.urlContains(browser.params.validToolAddress + '/login'));
  await arbitrationPage.login.clear();
  await arbitrationPage.password.clear();
  await arbitrationPage.login.sendKeys(browser.params.validLogin);
  await arbitrationPage.password.sendKeys(browser.params.validPassword);
  await arbitrationPage.loginBtn.click();
  await browser.wait(ExpectedConditions.urlContains(browser.params.validToolAddress + '/resource'));
  await browser.wait(ExpectedConditions.elementToBeClickable(arbitrationPage.resourceBtn));
  await arbitrationPage.resourceBtn.click();
  await arbitrationPage.dialogOkBtn.click();
  await browser.wait(
    ExpectedConditions.urlContains(
      browser.params.validToolAddress + '/resource/' + browser.params.resource + 'Recipe',
    ),
  );
}

/**
 * Change the value of a cell in the recipe editor, accept the contents
 * and check and the value is equals to the entered one.
 * @param {string} value The input value that should be added.
 * @param {string} rowName The name of the row in the grid
 * @param {string} colId The id of the column in the grid
 */
export async function enterAndCheckValue_rowNamed_colId(
  value: string,
  rowName: string,
  colId: string,
) {
  await enterValue_rowNamed_colId(value, rowName, colId);
  await waitForLongOperation();
  await checkValue_rowNamed_colId(value, rowName, colId);
}

/**
 * Check that the value of a cell in the recipe editor, is equals to the entered value
 * @param {string} value The input value that should be added.
 * @param {string} rowName The name of the row in the grid
 * @param {string} colId The id of the column in the grid
 */
export async function checkValue_rowNamed_colId(value: string, rowName: string, colId: string) {
  if (parseInt(colId, 10)) {
    await moveGridSelectionfromRowID(rowName, Key.ARROW_RIGHT, parseInt(colId, 10));
  }
  const cell = getAgCell(rowName, colId);
  expect(await cell.getText()).toContain(value);
}

/**
 * Wait for the item to be clickable and modifiable and click on it
 * @param {ElementFinder} item The item we'd like to click on
 */
export async function waitForItemToShowAndClick(item: ElementFinder) {
  await browser.wait(ExpectedConditions.presenceOf(item));
  await browser.wait(ExpectedConditions.elementToBeClickable(item));
  await item.click();
}

/**
 * Wait for the item to be clickable and modifiable and click on it
 * @param {ElementFinder} item The item we'd like to click on
 */
export async function waitForItemToShowWaitAndClick(item: ElementFinder) {
  await browser.wait(ExpectedConditions.presenceOf(item));
  await browser.sleep(1500);
  await browser.wait(ExpectedConditions.elementToBeClickable(item));
  await item.click();
}

/**
 * Change the value of a cell in the recipe editor, accept the contents.
 * Used for text fields
 * @param {string} value The input value that should be added.
 * @param {string} rowName The name of the row in the grid
 * @param {string} colId The id of the column in the grid
 */
export async function enterValue_rowNamed_colId(value: string, rowName: string, colId: string) {
  const cell = getAgCell(rowName, colId);
  await waitForItemToShowAndClick(cell);
  await browser
    .actions()
    .sendKeys(Key.ENTER)
    .perform(); // replace the double click
  await browser.wait(ExpectedConditions.presenceOf(recipePage.agInput));
  await recipePage.agInput.sendKeys(value);
  await browser
    .actions()
    .sendKeys(Key.ENTER)
    .perform();
  await browser.wait(ExpectedConditions.presenceOf(cell));
  await browser.wait(ExpectedConditions.elementToBeClickable(cell));
}

/**
 * Select a value of a cell in the recipe editor, accept it.
 * Used for dropdown lists
 * @param {string} value The input value that should be added.
 * @param {string} rowName The name of the row in the grid
 * @param {string} colId The id of the column in the grid
 */
export async function selectValue_rowNamed_colId(value: string, rowName: string, colId: string) {
  const cell = getAgCell(rowName, colId);
  await waitForItemToShowAndClick(cell);
  await browser
    .actions()
    .sendKeys(Key.ENTER)
    .perform(); // replace the double click
  await browser.wait(ExpectedConditions.presenceOf(recipePage.agInput));
  await getAgCellEditInputOption(value).click();
  await browser.wait(ExpectedConditions.presenceOf(cell));
  await browser.wait(ExpectedConditions.elementToBeClickable(cell));
}

/**
 * Reset grid selection to top left corner (Row0, Col1).
 */
export async function resetGridSelectionToOrigin() {
  await waitForItemToShowAndClick(recipePage.agGridCellOrigin);
}

/**
 * Reset the grid cell selection to top left corner and move it in a given direction.
 * The goal of this method is to be able to show any cell of the grid.
 * If the cell is not shown, it cannot be accessed or modified.
 * @param {any} key Pressable keys usually Up, Down, Left and Right keys
 * @param {number} numOfTimes Number of times the key is pressed.
 */
export async function moveGridSelectionFromOrigin(key: any, numOfTimes: number) {
  await resetGridSelectionToOrigin();
  await pressKey_xTimes(key, numOfTimes);
}

/**
 * Move Grid cell selection in a given direction.
 * The goal of this method is to be able to show any cell of the grid.
 * If the cell is not shown, it cannot be accessed or modified.
 * @param {any} key Pressable keys usually Up, Down, Left and Right keys
 * @param {number} numOfTimes Number of times the key is pressed.
 */
export async function moveGridSelectionFromCurrent(key: any, numOfTimes: number) {
  await pressKey_xTimes(key, numOfTimes);
}

/**
 * Move Grid cell selection in a given direction based on a rowID input.
 * The goal of this method is to be able to show any cell of the grid.
 * If the cell is not shown, it cannot be accessed or modified
 * @param {string} rowName The name of the row in the grid
 * @param {any} key Pressable keys usually Up, Down, Left and Right keys
 * @param {number} numOfTimes Number of times the key is pressed.
 */
export async function moveGridSelectionfromRowID(rowName: string, key: any, numOfTimes: number) {
  const cell = getAgCell(rowName, '1');
  await waitForItemToShowAndClick(cell);
  await pressKey_xTimes(key, numOfTimes);
}

/**
 * Move Grid cell selection in a given direction based on a rowID input.
 * The goal of this method is to be able to show any cell of the grid.
 * If the cell is not shown, it cannot be accessed or modified
 * @param {string} agGroup: e2e tag of the specific ag group
 * @param {string} rowName The name of the row in the grid
 * @param {any} key Pressable keys usually Up, Down, Left and Right keys
 * @param {number} numOfTimes Number of times the key is pressed.
 */
export async function moveEEGridSelectionfromRowID(
  agGroup: string,
  rowName: string,
  key: any,
  numOfTimes: number,
) {
  const cell = getAgCellbyAgGroup(agGroup, rowName, '1');
  await waitForItemToShowAndClick(cell);
  await pressKey_xTimes(key, numOfTimes);
}

/**
 * Scroll keystrokes (up or down arrow buttons) by pressing up or down keys x times.
 * @param {ElementFinder} para Element to move to before scroll
 * @param {any} key Pressable keys usually Up, Down, Left and Right keys
 * @param {number} numOfTimes Number of times the key is pressed.
 */
export async function scrollUpDownInElement(para: ElementFinder, key: any, numOfTimes: number) {
  await waitForItemToShowAndClick(para);
  await pressKey_xTimes(key, numOfTimes);
}

/**
 * Press a given key a number of given times
 * @param {any} key The input key that should be pressed
 * @param {number} numOfTimes The number of times the key should be pressed
 */
async function pressKey_xTimes(key: any, numOfTimes: number) {
  for (let i = 0; i < numOfTimes; i++) {
    await browser
      .actions()
      .sendKeys(key)
      .perform();
  }
}

/*
 * Get current YYYY-MM-DD
 */
export function getDate() {
  const currentDate = new Date();
  return (
    currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate()
  ); // YYYY-MM-DD
}

/**
 * Check for warning message from a dialog box.
 * @param {string} test string of the warning message
 */
export async function checkDialogWarningMessage(text: string) {
  await browser.wait(ExpectedConditions.presenceOf(recipePage.dialogWarningMessage));
  await browser.wait(
    ExpectedConditions.textToBePresentInElement(recipePage.dialogWarningMessage, text),
    10000,
  );
}

/**
 * Attempt to change value on grid. Expect '.ag-cell-edit-input' to be false.
 * Used for text fields
 * @param {string} rowName The name of the row in the grid
 * @param {string} colId The id of the column in the grid
 */
export async function isGridCellNotEditable(rowName: string, colId: string) {
  const cell = getAgCell(rowName, colId);
  await waitForItemToShowAndClick(cell);
  await browser
    .actions()
    .sendKeys(Key.ENTER)
    .perform(); // replace the double click
  await browser.wait(ExpectedConditions.elementToBeClickable(cell));
  expect(await recipePage.agInput.isPresent()).toBe(false);
}

/**
 * Check AG-Grid cell value against a given value. It should be equal.
 * Used for text fields
 * @param {string} rowName The name of the row in the grid
 * @param {string} colId The id of the column in the grid
 * @param {string} value The input value that should be checked.
 */
export async function checkAGCellValueEqual(rowName: string, colId: string, value: string) {
  const cell = getAgCell(rowName, colId);
  expect(await cell.getText()).toEqual(value);
}

/**
 * Change the value of a cell in the recipe editor, accept the contents
 * and check and the value is equals to the entered one.
 * @param {string} agGroup e2e tag of ag Group
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The id of the column in the grid
 * @param {string} value The input value that should be added.
 */
export async function enterAndCheckCellValueByGridGroup(
  agGroup: string,
  rowName: string,
  colName: string,
  value: string,
) {
  await enterAgCellValueByGridGroup(agGroup, rowName, colName, value);
  await waitForLongOperation();
  await checkAgCellValueByGridGroup(agGroup, rowName, colName, value);
}

/**
 * Change the value of a cell in the recipe editor, accept the contents.
 * Used for text fields
 * @param {string} agGroup e2e tag of ag Group
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The id of the column in the grid
 * @param {string} value The input value that should be added.
 */
export async function enterAgCellValueByGridGroup(
  agGroup: string,
  rowName: string,
  colName: string,
  value: string,
) {
  const cell = getAgCellbyAgGroup(agGroup, rowName, colName);
  await waitForItemToShowAndClick(cell);
  await browser
    .actions()
    .sendKeys(Key.ENTER)
    .perform(); // replace the double click
  await browser.wait(ExpectedConditions.presenceOf(recipePage.agInput));
  await recipePage.agInput.sendKeys(value);
  await browser
    .actions()
    .sendKeys(Key.ENTER)
    .perform();
  await browser.wait(ExpectedConditions.presenceOf(cell));
  await browser.wait(ExpectedConditions.elementToBeClickable(cell));
}

/**
 * Check that the value of a cell in the recipe editor, is equals to the entered value
 * @param {string} agGroup e2e tag of ag Group
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The id of the column in the grid
 * @param {string} value The input value that should be added.
 */
export async function checkAgCellValueByGridGroup(
  agGroup: string,
  rowName: string,
  colName: string,
  value: string,
) {
  const cell = getAgCellbyAgGroup(agGroup, rowName, colName);
  await browser.wait(ExpectedConditions.presenceOf(cell));
  await browser.wait(ExpectedConditions.elementToBeClickable(cell));
  expect(await cell.getText()).toContain(value);
}

/**
 * Select the value of a cell from a drop down list in the recipe editor, accept the contents
 * and check and the value is equals to the entered one.
 * @param {string} agGroup e2e tag of ag Group
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The id of the column in the grid
 * @param {string} value The input value that should be added.
 */
export async function selectAndCheckCellValueByGridGroup(
  agGroup: string,
  rowName: string,
  colName: string,
  value: string,
) {
  await selectAgCellValueByGridGroup(agGroup, rowName, colName, value);
  await waitForLongOperation();
  await checkAgCellValueByGridGroup(agGroup, rowName, colName, value);
}

/**
 * Select the value of a cell from a drop down list in the recipe editor, accept the contents.
 * Used for text fields
 * @param {string} agGroup e2e tag of ag Group
 * @param {string} rowName The name of the row in the grid
 * @param {string} colName The id of the column in the grid
 * @param {string} value The input value that should be added.
 */
export async function selectAgCellValueByGridGroup(
  agGroup: string,
  rowName: string,
  colName: string,
  value: string,
) {
  const cell = getAgCellbyAgGroup(agGroup, rowName, colName);
  await waitForItemToShowAndClick(cell); // select the cell
  await browser // select drop down list
    .actions()
    .sendKeys(Key.ENTER)
    .perform();
  await browser.wait(ExpectedConditions.presenceOf(recipePage.agInput));
  await getAgCellEditInputOption(value).click(); // select the parameter value
  await browser // deselect drop down list
  .actions()
  .sendKeys(Key.ESCAPE)
  .perform();
  await browser.wait(ExpectedConditions.presenceOf(cell));
  await browser.wait(ExpectedConditions.elementToBeClickable(cell));
}

/**
 * Check the .invalid class of element and check if it contains the value string
 * @param {string} agGroup e2e tag of ag Group
 * @param {string} value The input value that should be added.
 */
export async function checkAgInvalidCellValuePresentByGridGroup(
  agGroup: string,
  attributeName: string,
  invalidValue: string,
) {
  const cell = getAgInvalidCellbyAgGroup(agGroup);
  await browser.wait(ExpectedConditions.presenceOf(cell));
  await browser.wait(ExpectedConditions.elementToBeClickable(cell));
  await waitForItemToShowAndClick(cell); // select the cell
  expect(await cell.getAttribute(attributeName)).toContain(invalidValue);
}

/**
 * Verify the absence of invalid class cell in the specfied ag Group
 * @param {string} agGroup e2e tag of ag Group
 */
export async function verifyAgInvalidCellAbsentByGridGroup(
  agGroup: string,
) {
  const cell = getAgInvalidCellbyAgGroup(agGroup);
  await browser.wait(ExpectedConditions.stalenessOf(cell));
}

/**
 * Check the .mat-error class of element and check if it contains the value string
 * @param {string} agGroup e2e tag of ag Group
 * @param {string} value The input value that should be added.
 */
export async function checkMatErrorTextByGridGroup(
  agGroup: string,
  stringText: string,
) {
  const cell = getMatErrorElementbyAgGroup(agGroup);
  await browser.wait(ExpectedConditions.presenceOf(cell));
  await browser.wait(ExpectedConditions.elementToBeClickable(cell));
  expect(await cell.getText()).toContain(stringText);
}

/**
 * Check the .mat-error class of element and check if it contains the value string
 * @param {string} agGroup e2e tag of ag Group
 */
export async function verifyMatErrorTextAbsentByGridGroup(
  agGroup: string,
) {
  const cell = getMatErrorElementbyAgGroup(agGroup);
  await browser.wait(ExpectedConditions.stalenessOf(cell));
}
/**
 * Check the .mat-error class of element and check if it contains the value string
 * @param {string} agGroup e2e tag of ag Group
 * @param {string} value The input value that should be added.
 */
export async function checkMatCardTextByGridGroup(
  agGroup: string,
  stringText: string,
) {
  const cell = getMatCardElementbyAgGroup(agGroup);
  await browser.wait(ExpectedConditions.presenceOf(cell));
  await browser.wait(ExpectedConditions.elementToBeClickable(cell));
  expect(await cell.getText()).toContain(stringText);
}
