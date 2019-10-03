import { Key, browser } from 'protractor';

import * as page from './recipe-editor.po';

import {
  loginWithRecipe,
  waitForItemToShowAndClick,
  enterAndCheckValue_rowNamed_colId,
  moveGridSelectionFromCurrent,
  resetGridSelectionToOrigin,
} from '../util/helper-functions';
import { checkBeforeClosingRecipe } from '../util/recipe-functions';
import { cssElementContainingText } from '../util/selector-functions';

const validationMsg = 'Flow of gas HBr (#Gas4) > 95% full scale value.'; // Validation message

describe('Recipe Validation', () => {
  beforeAll(async () => {
    console.log('== Start running validation.e2e-specs.ts ==');
    await loginWithRecipe(browser.params.recipeName);
  });

  afterAll(async () => {
    await waitForItemToShowAndClick(page.setpointsTab);
    await checkBeforeClosingRecipe();
  });

  it('RE-TC80: Should be able to change Gas4 to trigger validation rule', async () => {
    await waitForItemToShowAndClick(page.setpointsTab);
    await moveGridSelectionFromCurrent(Key.ARROW_UP, 15);
    await resetGridSelectionToOrigin();
    await enterAndCheckValue_rowNamed_colId('490', 'Gas4', '3');
  });

  it('RE-TC81: Should be able to click on validate tab', async () => {
    await waitForItemToShowAndClick(page.validateTab);
    await waitForItemToShowAndClick(page.validateBtn);
  });

  it('RE-TC82: Should expect Gas4 validation warning message triggered', async () => {
    await waitForItemToShowAndClick(page.validateTab);
    const triggeredRule = cssElementContainingText('.mat-cell', validationMsg);
    // verify validation warning message exists
    expect(await triggeredRule.getText()).toBe(validationMsg);
  });

  it('RE-TC83: Should go back to setpoint page', async () => {
    await waitForItemToShowAndClick(page.setpointsTab);
    await moveGridSelectionFromCurrent(Key.ARROW_UP, 15);
    await resetGridSelectionToOrigin();
  });

  it('RE-TC84: Should be able to change the setpoint to meet validation warning', async () => {
    await enterAndCheckValue_rowNamed_colId('440', 'Gas4', '3');
    await waitForItemToShowAndClick(page.validateTab);
    await waitForItemToShowAndClick(page.validateBtn);
    const triggeredRule = cssElementContainingText('.mat-cell', validationMsg);
    // verify validation warning message recovered
    expect(browser.isElementPresent(triggeredRule)).toBeFalsy();
  });
});
