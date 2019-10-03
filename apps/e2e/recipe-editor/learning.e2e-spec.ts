import { browser, Key } from 'protractor';

import * as page from './recipe-editor.po';
import {
  loginWithRecipe,
  waitForItemToShowAndClick,
  checkValue_rowNamed_colId,
} from '../util/helper-functions';
import { checkBeforeClosingRecipe } from '../util/recipe-functions';
import { getAgCell } from '../util/selector-functions';

// TODO: Determine how reset should be tested - these tests seem to be recipe-specific
describe('Learnt Values', () => {
  beforeAll(async function() {
    console.log('== Start running learning.e2e-specs.ts ==');
    await loginWithRecipe(browser.params.recipeName);
  });

  afterAll(async () => {
    // check and close existing recipe and return to Create/Open Recipe menu.
    await checkBeforeClosingRecipe();
  });

  it('RE-TC44: Should select Detail Process & System', async () => {
    await waitForItemToShowAndClick(page.viewDetailList);
    await waitForItemToShowAndClick(page.processAndSystemOption);
    await browser
      .actions()
      .sendKeys(Key.ESCAPE)
      .perform();
  });

  it('RE-TC45: Should hide subsystem and select only RF sybsystem', async () => {
    await waitForItemToShowAndClick(page.subsystemsFilterList);
    await waitForItemToShowAndClick(page.hideSubsystemsOption);
    await waitForItemToShowAndClick(page.rfSubsystemsOption);
    await waitForItemToShowAndClick(page.stepSubsystemsOption);
    await browser
      .actions()
      .sendKeys(Key.ESCAPE)
      .perform();
  });

  // __PDE_Season_Base recipe step 2 TCPRFPowerCompensatedLearned setpoint not equal to 0.
  it('RE-TC46: Should learnt values not zero', async () => {
    const cell = getAgCell('TCPRFPowerCompensatedLearned', '2');
    expect(await cell.getText()).toBeGreaterThan(0);
  });

  // __PDE_Season_Base recipe step 2 TCPRFPowerCompensatedLearned setpoint changed to 0.
  it('RE-TC47: Should reset learnt values reset to zero', async () => {
    await waitForItemToShowAndClick(page.resetLearnedValuesBtn);
    await browser.sleep(1000); // time to wait for value to reset.
    await checkValue_rowNamed_colId('0', 'TCPRFPowerCompensatedLearned', '2');
  });
});
