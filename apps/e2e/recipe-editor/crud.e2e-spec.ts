import { browser, ExpectedConditions, Key } from 'protractor';

import * as page from './recipe-editor.po';
import {
  loginWithRecipe,
  waitForLongOperation,
  enterAndCheckValue_rowNamed_colId,
  waitForItemToShowAndClick,
  getDate,
  moveGridSelectionFromOrigin,
  moveGridSelectionfromRowID,
} from '../util/helper-functions';
import {
  closeExistingRecipe,
  saveAsRecipe,
  openProcessRecipe,
  deleteProcessRecipe,
  createNewRecipe,
  checkBeforeClosingRecipe,
} from '../util/recipe-functions';

const newRecipe = browser.params.recipeName + '-' + getDate(); // Concatanate original

describe('Recipes', () => {
  beforeAll(async () => {
    console.log('== Start running crud.e2e-specs.ts ==');
    await loginWithRecipe(browser.params.recipeName);
    // check and close existing recipe and return to Create/Open Recipe menu.
    await checkBeforeClosingRecipe();
  });

  afterAll(async () => {
    // check and close existing recipe and return to Create/Open Recipe menu.
    await checkBeforeClosingRecipe();
  });

  describe('New Recipe Tests ', () => {
    // Create a new recipe by setting valid setpoints
    it('RE-TC29: Should be able to create a new recipe', async () => {
      await createNewRecipe();
      await page.selectedRecipeName.isPresent();
    });

    // enter process time at Step 1
    it('RE-TC30: Should be able to enter process time at Step 1', async () => {
      await enterAndCheckValue_rowNamed_colId('30', 'processTime', '1');
    });

    // enter pressure at Step 1
    it('RE-TC31: Should be able to enter pressure at Step 1', async () => {
      await enterAndCheckValue_rowNamed_colId('5', 'pressure', '1');
    });

    // enter helium setpoint at Step 1
    it('RE-TC32: Should be able to enter helium setpoint at Step 1', async () => {
      await moveGridSelectionFromOrigin(Key.ARROW_DOWN, 70);
      await enterAndCheckValue_rowNamed_colId('6', 'Helium', '1');
      await moveGridSelectionfromRowID('Helium', Key.ARROW_UP, 70);
    });

    // enter dechhuckBKM
    it('RE-TC33: Should be able to select dechuckBKM', async () => {
      await waitForItemToShowAndClick(page.dechuckBkm);
      await browser.wait(ExpectedConditions.presenceOf(page.bkmOptionCoulombicDechuckRevG));
      await browser.wait(
        ExpectedConditions.elementToBeClickable(page.bkmOptionCoulombicDechuckRevG),
      );
      await page.bkmOptionCoulombicDechuckRevG.click();
      await browser.wait(ExpectedConditions.stalenessOf(page.bkmOptionCoulombicDechuckRevG));
      await page.constantsTab.click();
      await page.setpointsTab.click();
      await browser
        .actions()
        .sendKeys(Key.ESCAPE)
        .perform();
    });

    // Save new recipe
    it('RE-TC34: Should be able to save new recipe', async () => {
      await saveAsRecipe('newRecipe');
      await waitForLongOperation(); // need this wait so the previous recipe can be closed
    });

    // Close new recipe
    it('RE-TC35: Should be able to close new recipe', async () => {
      /* executing the following will post error
        "UnhandledPromiseRejectionWarning: Unhandled promise rejection.
        This error originated either by throwing inside of an async function without a catch block,
        or by rejecting a promise which was not handled with .catch(). (rejection id: 3)""
        //await page.selectedRecipeName.isPresent();
        //await page.selectedRecipeName.evaluate('newRecipe');
        */
      await closeExistingRecipe();
      await browser.wait(ExpectedConditions.presenceOf(page.createOrOpenRecipeTitle));
    });

    // Open new recipe
    it('RE-TC36: Should be able open new recipe', async () => {
      await openProcessRecipe('newRecipe');
      await page.selectedRecipeName.isPresent();
    });

    // Delete new recipe
    it('RE-TC37: Should be able to delete new recipe', async () => {
      await deleteProcessRecipe('newRecipe');
      await waitForLongOperation(); // need this wait so the previous recipe can be closed
    });
  });

  describe('Existing Recipe Tests', () => {
    it('RE-TC38: Should save recipe using Save-as', async () => {
      await openProcessRecipe(browser.params.recipeName);
      await waitForLongOperation(); // need this wait so the previous recipe can be closed
      await saveAsRecipe(newRecipe);
      await waitForLongOperation(); // need this wait so the previous recipe can be closed
    });

    it('RE-TC39: Should close saved recipe', async () => {
      await closeExistingRecipe();
      await browser.wait(ExpectedConditions.presenceOf(page.createOrOpenRecipeTitle));
    });

    it('RE-TC40: Should open saved recipe', async () => {
      await openProcessRecipe(newRecipe);
    });

    it('RE-TC41: Should delete currently opened recipe', async () => {
      await deleteProcessRecipe(newRecipe);
      await browser.wait(ExpectedConditions.presenceOf(page.createOrOpenRecipeTitle));
    });
  });

  describe('Opened Recipe Tests', () => {
    // Prepare saved recipe
    it('RE-TC42: Should be able to save an existing recipe', async () => {
      await openProcessRecipe(browser.params.recipeName);
      await saveAsRecipe(newRecipe);
      await waitForLongOperation(); // need this wait so the previous recipe can be closed
      await closeExistingRecipe();
      await browser.wait(ExpectedConditions.presenceOf(page.createOrOpenRecipeTitle));
    });

    // Delete saved recipe while another recipe is opened.
    it('RE-TC43: Should be able to delete recipe A while recipe B is opened', async () => {
      await openProcessRecipe(browser.params.recipeName);
      await deleteProcessRecipe(newRecipe);
    });
  });
});
