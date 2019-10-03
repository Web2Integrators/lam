import { browser, ExpectedConditions, Key } from 'protractor';

import * as page from './recipe-editor.po';
import {
  loginWithRecipe,
  selectValue_rowNamed_colId,
  enterAndCheckValue_rowNamed_colId,
  enterValue_rowNamed_colId,
  waitForItemToShowAndClick,
  checkValue_rowNamed_colId,
  waitForLongOperation,
  moveGridSelectionFromOrigin,
  moveGridSelectionFromCurrent,
  resetGridSelectionToOrigin,
} from '../util/helper-functions';
import { checkBeforeClosingRecipe } from '../util/recipe-functions';

describe('Recipe Contents', () => {
  beforeAll(async () => {
    console.log('== Start running controllables.e2e-specs.ts ==');
  });

  afterAll(async () => {
    // check and close existing recipe and return to Create/Open Recipe menu.
    await checkBeforeClosingRecipe();
  });

  describe('Recipe Menu', () => {
    it('RE-TC6: Should allow selection of recipe and open recipe', async () => {
      await loginWithRecipe(browser.params.recipeName);
    });

    it('RE-TC7: Should verify opened recipe name', async () => {
      // That is a double check (because already included in openProcessRecipe function) but here it
      // is considered as a test
      expect(await page.bufferBtn.getText()).toEqual(browser.params.recipeName);
    });
  });

  describe('Recipe Parameters', () => {
    describe('Setpoints Page (Controllables)', () => {
      it('RE-TC8: Should be able to choose in a list of items: Change "Step Type" to "Stab"', async () => {
        await selectValue_rowNamed_colId('Stab', 'stepType', '2');
      });
      it('RE-TC9: Should be able to change a string parameter: Change "Step Description" to "ME1b"', async () => {
        await enterAndCheckValue_rowNamed_colId('ME1b', 'RecipeStepName', '3');
      });
      it(
        'RE-TC10: Should be able to change an int parameter: ' +
          'Change "Process Time (sec)" to 35 sec',
        async () => {
          await enterAndCheckValue_rowNamed_colId('35', 'processTime', '4');
        },
      );
      it(
        'RE-TC11: Should be able to change a controled parameter without triggering an alarm:' +
          ' Change "Pressure" to 40',
        async () => {
          await enterAndCheckValue_rowNamed_colId('40', 'pressure', '3');
        },
      );
      it(
        'RE-TC12: Should trigger an alarm when a changed parameter value is out of range' +
          ' Change "Pressure" to 4000',
        async () => {
          await enterValue_rowNamed_colId('4000', 'pressure', '4');
          expect(await page.modalDetailsDialogTitle.getText()).toContain(
            'Invalid Setpoint Value Entered',
          );
          await waitForItemToShowAndClick(page.modalDetailsDialogOk);
        },
      );
    });
    describe('Setpoints page (Filters)', () => {
      it('RE-TC13: Should select "Process & system" in View Detail show more parameters (in gray)', async () => {
        await page.viewDetailList.click();
        await waitForItemToShowAndClick(page.processAndSystemOption);
        await browser.wait(ExpectedConditions.stalenessOf(page.processAndSystemOption));
        await browser.wait(ExpectedConditions.presenceOf(page.aRandomGreyItem));
      });
      it('RE-TC14: Should be able to filter only the "RF" subsystem', async () => {
        await page.subsystemsFilterList.click();
        await waitForItemToShowAndClick(page.hideSubsystemsOption);
        await waitForItemToShowAndClick(page.rfSubsystemsOption);
        await waitForItemToShowAndClick(page.stepSubsystemsOption);
        await browser
          .actions()
          .sendKeys(Key.ESCAPE)
          .perform();
        // TODO Check that the table contains the row headers beginning with RF?
      });
      it(
        'RE-TC15: Should be able to change int values in the selected subsystem ' +
          '"Bias RF Hold Time" to 2 sec',
        async () => {
          await enterAndCheckValue_rowNamed_colId('2', 'BiasRFHoldTime', '4');
        },
      );
      it(
        'RE-TC16: Should be able to change int values in the selected subsystem ' +
          '"Bias RF Duty Cycle (%)" to 55',
        async () => {
          await enterAndCheckValue_rowNamed_colId('55', 'BiasRFPulseDutyCycleSetpoint', '4');
        },
      );
      it(
        'RE-TC17: Should be able to choose a value in a list in the selected subsystem: ' +
          'Set "Bias RF Output Mode" to "Pulse"',
        async () => {
          await selectValue_rowNamed_colId('Pulsing', 'BiasRFOutputModeSetpoint', '4');
        },
      );
      it('RE-TC18: Should be able to select detail: "Process"', async () => {
        await waitForItemToShowAndClick(page.viewDetailList);
        await waitForItemToShowAndClick(page.processOption);
        await browser
          .actions()
          .sendKeys(Key.ESCAPE)
          .perform();
        await browser.wait(ExpectedConditions.stalenessOf(page.processOption));
      });
      // https://oasisdigital.atlassian.net/browse/LPDE-258

      it('RE-TC19: Should be able to change a value in another tab: "TCU Ch1 Temperature" to 20	', async () => {
        await waitForItemToShowAndClick(page.constantsTab);
        await enterAndCheckValue_rowNamed_colId('20', 'TCUCh1CurrentTemperatureSetpoint', 'value');
      });

      it('RE-TC20: Should preserve the previous filters when changing tab', async () => {
        await page.setpointsTab.click();
        expect(await page.subsystemsFilterList.getText()).toEqual('RF,');
        expect(await page.viewDetailList.getText()).toEqual('Process');
      });
    });

    describe('Changing Gas Values', () => {
      it('RE-TC21: Should select the "Reactants" & "Chuck" Subsystems filter', async () => {
        await waitForItemToShowAndClick(page.subsystemsFilterList);
        await waitForItemToShowAndClick(page.hideSubsystemsOption);
        await waitForItemToShowAndClick(page.reactantsSubsystemsOption);
        await waitForItemToShowAndClick(page.chuckSubsystemsOption);
        await browser
          .actions()
          .sendKeys(Key.ESCAPE)
          .perform();
      });
      it('RE-TC22: Should change "Gas Injection Ratio" to "Edge"	', async () => {
        await selectValue_rowNamed_colId('Edge', 'GasInjectionRatioSetpoint', '2');
      });
      it('RE-TC23: Should change "HBr" (Gas4) to 500', async () => {
        await moveGridSelectionFromCurrent(Key.ARROW_UP, 14);
        await resetGridSelectionToOrigin();
        await enterAndCheckValue_rowNamed_colId('500', 'Gas4', '3');
      });
      it('RE-TC24: Should change Step 4: ME2 Change "HBr Manifold" to Tuning', async () => {
        await selectValue_rowNamed_colId('Tuning', 'Gas4_ProcessTypeSetpoint', '4');
      });
      it('RE-TC25: Should change some int value: "Mid Inner ESC Temp" to 65	', async () => {
        await moveGridSelectionFromOrigin(Key.ARROW_DOWN, 50);
        await enterAndCheckValue_rowNamed_colId('65', 'MidInnerESCTemperature_AO', '3');
      });
      it('RE-TC26: Should change "TCU Channel" to "TCU_Ch1"	', async () => {
        await selectValue_rowNamed_colId('TCU_Ch1', 'TCUChannelSelect', '4');
      });
    });
    describe('Tolerances Tab Selection', () => {
      beforeAll(async () => {
        await moveGridSelectionFromCurrent(Key.ARROW_UP, 50);
      });

      it('RE-TC27: Should show tolerances', async () => {
        await waitForItemToShowAndClick(page.toggleTolerancesBtn);
        await waitForLongOperation();
        await checkValue_rowNamed_colId('± 5%', 'Gas1', '1 Soft');
        await checkValue_rowNamed_colId('± 10%', 'Gas1', '1 Hard');
        await waitForLongOperation();
      });

      it('RE-TC28: Should hide Tolerances', async () => {
        await waitForItemToShowAndClick(page.toggleTolerancesBtn);
        await waitForLongOperation();
        await checkValue_rowNamed_colId('0', 'Gas1', '2');
        await checkValue_rowNamed_colId('0', 'Gas1', '3');
        await waitForLongOperation();
      });
    });
  });
});
