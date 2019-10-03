import { browser, ExpectedConditions } from 'protractor';

import * as pageRecipe from '../recipe-editor/recipe-editor.po';
import { discardEndPointChanges, enterStep1DefaultParameters } from '../util/endpoint-functions';
import { checkBeforeClosingRecipe } from '../util/recipe-functions';
import { waitForItemToShowAndClick, waitForItemToShowWaitAndClick } from '../util/helper-functions';

xdescribe('Endpoint Editor - Step 4', () => {
  browser.waitForAngularEnabled(false);

  beforeAll(async () => {
    console.log('== Start running s4-settings.e2e-spec.ts ==');
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

  it('EE-TC36: Should load IB1 and IB2 values', async () => {
    await enterStep1DefaultParameters();
  });
});
