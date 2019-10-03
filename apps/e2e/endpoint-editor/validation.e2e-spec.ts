import { browser } from 'protractor';
import { discardEndPointChanges } from '../util/endpoint-functions';
import { checkBeforeClosingRecipe } from '../util/recipe-functions';

xdescribe('Validation', () => {
  browser.waitForAngularEnabled(false);

  beforeAll(async () => {
    console.log('== Start running validation.e2e-spec.ts ==');
    await browser.get(`/devMode?resource=${browser.params.resource}`);
  });

  afterAll(async () => {
    // check and close existing recipe and return to Create/Open Recipe menu.
    await discardEndPointChanges();
    await checkBeforeClosingRecipe();
  });
});
