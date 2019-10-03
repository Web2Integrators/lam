import { browser, ExpectedConditions, Key } from 'protractor';
import { $ } from 'protractor';

import * as page from '../recipe-editor/recipe-editor.po';
import {
  waitForLongOperation,
  waitForItemToShowAndClick,
  waitForItemToShowWaitAndClick,
  enterAndCheckValue_rowNamed_colId,
  checkValue_rowNamed_colId,
  moveGridSelectionFromOrigin,
} from '../util/helper-functions';

export async function checkOpenedRecipeName(name: string) {
  await browser.wait(ExpectedConditions.presenceOf(page.bufferBtn));
  await browser.wait(ExpectedConditions.textToBePresentInElement(page.bufferBtn, name), 10000);
}

/**
 * Create a new recipe
 */
export async function createNewRecipe() {
  await waitForLongOperation();
  await waitForItemToShowAndClick(page.createRecipeBtn);
  await waitForLongOperation();
}

/**
 * Open an existing recipe, select the given recipe and open it.
 * @param {string} name The name of the recipe
 */
export async function openProcessRecipe(name: string) {
  await waitForLongOperation();
  await browser.sleep(1000); // time to load the recipes... It should not be needed
  await waitForItemToShowAndClick(page.openRecipeBtn);
  await waitForLongOperation();
  await waitForItemToShowAndClick(page.recipeFilter);
  await waitForLongOperation();
  await browser
    .actions()
    .sendKeys(name)
    .perform();
  await waitForLongOperation();
  await waitForItemToShowAndClick(page.recipeToSelect);
  await page.selectRecipeBtn.click();
  await waitForLongOperation();
  await checkOpenedRecipeName(name);
}

/**
 * Close current open recipe.
 */
export async function closeExistingRecipe() {
  await browser.sleep(2000);
  await browser.wait(ExpectedConditions.presenceOf(page.bufferBtn));
  await waitForItemToShowWaitAndClick(page.fileDropdown);
  await waitForItemToShowWaitAndClick(page.closeBtn);
  if (await page.discardChangesBtn.isPresent()) {
    await page.discardChangesBtn.click();
  }
}
/**
 * Save As current open recipe.
 * @param {string} name The future name of the recipe
 */
export async function saveAsRecipe(name: string) {
  await waitForItemToShowWaitAndClick(page.fileDropdown);
  await waitForItemToShowWaitAndClick(page.saveAsBtn);
  await waitForItemToShowWaitAndClick(page.saveAsInput);
  await page.saveAsInput.clear();
  await waitForItemToShowWaitAndClick(page.saveAsInput);
  await browser
    .actions()
    .sendKeys(name)
    .perform();
  await waitForItemToShowWaitAndClick(page.saveDialogBtn);
  await waitForLongOperation();
  // Replace recipe if dialog box is present
  if (await page.confirmationDialogDo.isPresent()) {
    await page.confirmationDialogDo.click();
  }
  await browser.sleep(1000);
  await waitForLongOperation();
  await checkOpenedRecipeName(name);
}
/**
 * Delete a given recipe file
 * @param {string} name The name of the recipe to delete
 */
export async function deleteProcessRecipe(value: string) {
  await waitForItemToShowWaitAndClick(page.fileDropdown);
  await waitForItemToShowWaitAndClick(page.deleteBtn);
  await waitForItemToShowWaitAndClick(page.recipeFilter);
  await browser
    .actions()
    .sendKeys(value)
    .perform();
  await waitForLongOperation();
  await waitForItemToShowWaitAndClick(
    $('.mat-dialog-content')
      .$$('.ag-cell')
      .get(0),
  );
  await waitForLongOperation();
  await waitForItemToShowWaitAndClick(page.deleteRecipeBtn);
  await waitForItemToShowWaitAndClick(page.confirmationDialogDo);
}

/**
 * Check if an existing recipe is opened. If so, close the recipe and return to create/open new
 * recipe menu
 */
export async function checkBeforeClosingRecipe() {
  await waitForLongOperation(); // need this wait so the previous recipe can be closed properly.
  if (await page.fileDropdown.isPresent()) {
    await closeExistingRecipe();
    await browser.wait(ExpectedConditions.presenceOf(page.createOrOpenRecipeTitle));
  }
  await browser.wait(ExpectedConditions.presenceOf(page.createOrOpenRecipeTitle));
}

/**
 * Save As current open recipe with SRE-Enabled.
 * @param {string} name The future name of the recipe
 */
export async function saveAsSRERecipe(name: string) {
  await waitForItemToShowWaitAndClick(page.fileDropdown);
  await waitForItemToShowWaitAndClick(page.saveAsBtn);
  await waitForItemToShowWaitAndClick(page.saveAsInput);
  await page.saveAsInput.clear();
  await page.saveAsInput.sendKeys(name);
  await waitForItemToShowWaitAndClick(page.saveDialogBtn);
  await waitForLongOperation();
  // Replace recipe if dialog box is present
  if (await page.confirmationDialogDo.isPresent()) {
    await page.confirmationDialogDo.click();
  }
  await waitForLongOperation();
}

/**
 * Save As current open recipe with SRE-Enabled.
 * @param {string} name The future name of the recipe
 */
export async function saveAsSRELegacyRecipe(name: string) {
  await waitForItemToShowWaitAndClick(page.fileDropdown);
  await waitForItemToShowWaitAndClick(page.saveAsBtn);
  await waitForItemToShowWaitAndClick(page.saveAsInput);
  await page.saveAsInput.clear();
  await waitForItemToShowWaitAndClick(page.saveAsInput);
  await page.saveAsInput.sendKeys(name);
  await waitForItemToShowAndClick(page.sreEnabledOption);
  await waitForItemToShowWaitAndClick(page.saveDialogBtn);
  await waitForLongOperation();
  // Replace recipe if dialog box is present
  if (await page.confirmationDialogDo.isPresent()) {
    await page.confirmationDialogDo.click();
  }
  await waitForLongOperation();
}

/**
 * Create a new recipe with predefined values entered.
 */
export async function createNewRecipeWithVal() {
  await enterAndCheckValue_rowNamed_colId('30', 'processTime', '1');
  await enterAndCheckValue_rowNamed_colId('5', 'pressure', '1');
  await moveGridSelectionFromOrigin(Key.ARROW_DOWN, 70);
  await enterAndCheckValue_rowNamed_colId('6', 'Helium', '1');
}

/**
 * Check BKM Dechuck parameters
 */
export async function checkBKMDechuckParameters(col1: string) {
  await checkValue_rowNamed_colId('RPV Dechuck', 'RecipeStepName', col1);
  await checkValue_rowNamed_colId('RPVPinsUp', 'stepType', col1);
  await checkValue_rowNamed_colId('17', 'processTime', col1);
}
/**
 * Check BKM Transition parameters
 */
export async function checkBKMTransitionParameters(col1: string, col2: string, col3: string) {
  await checkValue_rowNamed_colId('TCP RampDown1', 'RecipeStepName', col1);
  await checkValue_rowNamed_colId('TCP RampDown1', 'RecipeStepName', col2);
  await checkValue_rowNamed_colId('TCP RampDown1', 'RecipeStepName', col3);
}

/**
 * Check BKM Step parameters
 */
export async function checkBKMStepParameters(col1: string, col2: string, col3: string) {
  await checkValue_rowNamed_colId('105', 'ValveActualPosition', col1);
  await checkValue_rowNamed_colId('97', 'ValveActualPosition', col2);
  await checkValue_rowNamed_colId('83', 'ValveActualPosition', col3);
}
