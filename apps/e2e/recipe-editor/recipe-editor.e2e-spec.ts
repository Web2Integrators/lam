import { ExpectedConditions, browser } from 'protractor';

import * as page from './recipe-editor.po';
import { openProcessRecipe, checkBeforeClosingRecipe } from '../util/recipe-functions';
import {
  waitForItemToShowAndClick,
  enterAndCheckValue_rowNamed_colId,
  checkValue_rowNamed_colId,
  waitForLongOperation,
  waitForItemToShowWaitAndClick,
} from '../util/helper-functions';

describe('Recipe Editor-RecipeGrid', () => {
  browser.waitForAngularEnabled(false);

  beforeAll(async () => {
    console.log('== Start running recipe-editor.e2e-specs.ts ==');
    await browser.get(`/devMode?resource=${browser.params.resource}`);
  });

  afterAll(async () => {
    // check and close existing recipe and return to Create/Open Recipe menu.
    await checkBeforeClosingRecipe();
  });

  describe('Recipe grid', () => {
    /* This step requires the step to create new recpie b/c we want the new step to be appended
      to the end. If addStepBtn were instead executed after values were set,
      the new step would be inserted at the beginning, which would confuse all the subsequent tests.
      TODO: make tests idempotent?
    */
    it('RE-TC66: Should allow appending a new step to a new recipe', async () => {
      await waitForItemToShowAndClick(page.createRecipeBtn);
      await browser.wait(ExpectedConditions.presenceOf(page.selectedRecipeName));
      // click Append Step button
      await waitForItemToShowWaitAndClick(page.addStepBtn);
      await browser.wait(ExpectedConditions.presenceOf(page.headerCell2));
    });

    describe('New recipe (Setpoints)', () => {
      it(
        'RE-TC67: Should be able to change process time setpoint in' +
          'Step 1: "Process Time (sec)" to 5 sec',
        async () => {
          await enterAndCheckValue_rowNamed_colId('5', 'processTime', '1');
        },
      );

      it(
        'RE-TC68: Should be able to change process time setpoint in' +
          'Step 2: "Process Time (sec)" to 15 sec',
        async () => {
          await enterAndCheckValue_rowNamed_colId('15', 'processTime', '2');
        },
      );

      it(
        'RE-TC69: Should be able to change pressure setpoint in' +
          'Step 1: "Pressure (mtorr)" to 30',
        async () => {
          await enterAndCheckValue_rowNamed_colId('30', 'pressure', '1');
        },
      );

      it(
        'RE-TC70: Should be able to change pressure time setpoint in' +
          'Step 2: "Pressure (mtorr)" to 40',
        async () => {
          await enterAndCheckValue_rowNamed_colId('40', 'pressure', '2');
        },
      );
    });

    describe('New Recipe (Steps)', () => {
      it('RE-TC71: Should be able to copy a step (1) and paste as a new step (2)', async () => {
        // Copy Step 1
        await waitForItemToShowWaitAndClick(page.headerMenuBtn1);
        await waitForItemToShowWaitAndClick(page.copyStep);

        // Paste step on Step2 grid
        await waitForItemToShowWaitAndClick(page.headerMenuBtn2);
        await waitForItemToShowWaitAndClick(page.pasteStep);
        await waitForLongOperation();
      });

      it('RE-TC72: Should validate each step process time and pressure values after pasting a step', async () => {
        // validate process time on each step
        await checkValue_rowNamed_colId('5', 'processTime', '1');
        await checkValue_rowNamed_colId('5', 'processTime', '2');
        await checkValue_rowNamed_colId('15', 'processTime', '3');

        // validate pressure on each step
        await checkValue_rowNamed_colId('30', 'pressure', '1');
        await checkValue_rowNamed_colId('30', 'pressure', '2');
        await checkValue_rowNamed_colId('40', 'pressure', '3');
      });

      it('RE-TC73: Should be able to copy a step (3) and replace a step (2)', async () => {
        // copy step 3
        await waitForItemToShowWaitAndClick(page.headerMenuBtn3);
        await waitForItemToShowWaitAndClick(page.copyStep);

        // replace step 2 with step 3
        await waitForItemToShowWaitAndClick(page.headerMenuBtn2);
        await waitForItemToShowWaitAndClick(page.replaceStep);
      });

      it(
        'RE-TC74: Should validate each step process time and pressure values' +
          'after replacing a step',
        async () => {
          // validate process time on each step
          await checkValue_rowNamed_colId('5', 'processTime', '1');
          await checkValue_rowNamed_colId('15', 'processTime', '2');
          await checkValue_rowNamed_colId('15', 'processTime', '3');

          // validate pressure on each step
          await checkValue_rowNamed_colId('30', 'pressure', '1');
          await checkValue_rowNamed_colId('40', 'pressure', '2');
          await checkValue_rowNamed_colId('40', 'pressure', '3');
        },
      );

      it('RE-TC75: Should be able to delete a step (step 2) from the recipe', async () => {
        // delete step2
        await waitForItemToShowWaitAndClick(page.headerMenuBtn2);
        await waitForItemToShowWaitAndClick(page.deleteStep);
      });

      it(
        'RE-TC76: Should validate each step process time and pressure values' +
          'after deleting a step',
        async () => {
          // validate process time on each step
          await checkValue_rowNamed_colId('5', 'processTime', '1');
          await checkValue_rowNamed_colId('15', 'processTime', '2');

          // validate pressure on each step
          await checkValue_rowNamed_colId('30', 'pressure', '1');
          await checkValue_rowNamed_colId('40', 'pressure', '2');

          // close existing recipe
          await checkBeforeClosingRecipe();
        },
      );
    });

    describe('Existing Recipe', () => {
      // open existing recipe
      it('RE-TC77: Should be able to copy-paste one step, change step description and delete', async () => {
        await browser.wait(ExpectedConditions.presenceOf(page.openRecipeBtn));
        await openProcessRecipe(browser.params.recipeName);

        // copy step 5: OE
        await checkValue_rowNamed_colId('OE', 'RecipeStepName', '5');
        await waitForItemToShowWaitAndClick(page.headerMenuBtn5);
        await waitForItemToShowWaitAndClick(page.copyStep);

        // paste before step 4:ME2
        await checkValue_rowNamed_colId('ME2', 'RecipeStepName', '4');
        await waitForItemToShowWaitAndClick(page.headerMenuBtn4);
        await waitForItemToShowWaitAndClick(page.pasteStep);
        await browser.sleep(3000); // allow page to refresh after deletion to get the right element.
        await checkValue_rowNamed_colId('OE', 'RecipeStepName', '4');

        // change Step 4: OE "Step Description" to ME
        await enterAndCheckValue_rowNamed_colId('ME', 'RecipeStepName', '4');
        await browser.wait(ExpectedConditions.presenceOf(page.headerMenuBtn4));

        // delete Step 6: OE	Column-header
        await browser.sleep(3000); // allow page to refresh after deletion to get the right element.
        await checkValue_rowNamed_colId('OE', 'RecipeStepName', '6');
        await waitForItemToShowWaitAndClick(page.headerMenuBtn6);
        await waitForItemToShowWaitAndClick(page.deleteStep);
      });

      it('RE-TC78: Should be able to copy and replace step', async () => {
        // Step 4: ME Copy step
        await browser.sleep(3000); // allow page to refresh after deletion to get the right element.
        await checkValue_rowNamed_colId('ME', 'RecipeStepName', '4');
        await waitForItemToShowWaitAndClick(page.headerMenuBtn4);
        await waitForItemToShowWaitAndClick(page.copyStep);

        // Step 5: Replace Step 5	exact copy of ME2
        await browser.sleep(3000); // allow page to refresh after deletion to get the right element.
        await checkValue_rowNamed_colId('ME2', 'RecipeStepName', '5');
        await waitForItemToShowWaitAndClick(page.headerMenuBtn5);
        await waitForItemToShowWaitAndClick(page.replaceStep);

        // Step 5: ME2	Delete step
        await browser.sleep(3000); // allow page to refresh after deletion to get the right element.
        await checkValue_rowNamed_colId('ME', 'RecipeStepName', '5');
        await waitForItemToShowWaitAndClick(page.headerMenuBtn5);
        await waitForItemToShowWaitAndClick(page.deleteStep);
      });

      it('RE-TC79: Should be able to delete first and last columns', async () => {
        // Step 1: Stab	Column-header click "Delete"
        await browser.sleep(3000); // allow page to refresh after deletion to get the right element.
        await checkValue_rowNamed_colId('Stab', 'RecipeStepName', '1');
        await waitForItemToShowWaitAndClick(page.headerMenuBtn1);
        await waitForItemToShowWaitAndClick(page.deleteStep);

        // Step 4: Stab	Column-header click "Delete"
        await browser.sleep(3000); // allow page to refresh after deletion to get the right element.
        await checkValue_rowNamed_colId('Stab.', 'RecipeStepName', '4');
        await waitForItemToShowWaitAndClick(page.headerMenuBtn4);
        await waitForItemToShowWaitAndClick(page.deleteStep);

        // Step 6: Dechuck 2	Column-header click "Delete"
        await browser.sleep(3000); // allow page to refresh after deletion to get the right element.
        await checkValue_rowNamed_colId('Dechuck 2', 'RecipeStepName', '6');
        await waitForItemToShowWaitAndClick(page.headerMenuBtn6);
        await waitForItemToShowWaitAndClick(page.deleteStep);

        // Step 5: Dechuck 1	Column-header click "Delete"
        await browser.sleep(3000);
        await checkValue_rowNamed_colId('Dechuck 1', 'RecipeStepName', '5');
        await waitForItemToShowWaitAndClick(page.headerMenuBtn5);
        await waitForItemToShowWaitAndClick(page.deleteStep);
      });
    });

    // Check footer info
    /*
Footer Info
Comment	Add "with SRE" to end of comment
Datalog	Select TEST-TCP

	Select File\Close	Recipe closes (without asking to save) [undesired]
	Select "File\Open"
	Enter "__PDE_Season_SRE2"
Footer Info
Settings Icon	Change PFT to <Disable>

	Select "File\Save"

	Select "File\Open"
	Click "Clean"
	Click "___KiyoFXE_AC9_BKM" & "OPEN"

Step 4:  Clean1	Change step time to 21 seconds
Menu select dropdown		[clean] in front & [modified] in back
*/
  });
});
