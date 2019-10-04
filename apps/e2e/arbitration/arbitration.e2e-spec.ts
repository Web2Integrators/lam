import { ExpectedConditions, browser } from 'protractor';

import * as page from './arbitration.po';
import { waitForLongOperation, waitForItemToShowAndClick } from '../util/helper-functions';

describe('Arbitration', () => {
  console.log('== Start running arbitration.e2e-specs.ts ==');
  browser.waitForAngularEnabled(false);

  describe('Session', () => {
    it('RE-TC1: Should give a warning if trying to connect to invalid tool address', async () => {
      await browser.get('/');
      await page.toolIdInput.clear();
      await page.toolIdInput.sendKeys('123.321.123321.213');
      await page.connectBtn.click();
      await page.dialogDismissBtn.isPresent();
      await waitForItemToShowAndClick(page.dialogDismissBtn);
      await page.warningMessage.isPresent();
    });

    it('RE-TC2: Should move on to the next screen if tool address is valid', async () => {
      await page.toolIdInput.clear();
      await page.toolIdInput.sendKeys(browser.params.validToolAddress);
      await page.connectBtn.click();
      await browser.wait(
        ExpectedConditions.urlContains('')
      );

    });
  });

  describe('Login', () => {
    it('RE-TC3: Should give a warning if trying to use an invalid login', async () => {
      await browser.wait(ExpectedConditions.elementToBeClickable(page.loginBtn));
      await page.login.clear();
      await page.password.clear();
      await page.login.sendKeys('invalid login');
      await page.password.sendKeys('invalid password');
      await browser.wait(ExpectedConditions.elementToBeClickable(page.loginBtn));
      await page.loginBtn.click();
      await waitForLongOperation();
      await page.warningMessage.isPresent();
    });

    it('RE-TC4: Should redirect to ewfeditor if login is valid', async () => {
      await page.login.clear();
      await page.password.clear();
      await page.login.sendKeys(browser.params.validLogin);
      await page.password.sendKeys(browser.params.validPassword);
      await browser.wait(ExpectedConditions.elementToBeClickable(page.loginBtn));
      await page.loginBtn.click();

      await page.dialogOkBtn.isPresent();
      await waitForItemToShowAndClick(page.dialogOkBtn);
      const val =  await browser.wait(ExpectedConditions.presenceOf(page.wfeEditor));
      console.log(val);
    });
  });

  // xdescribe('Resource', () => {
  //   it('RE-TC5: Should allow resource override and connect to resource', async () => {
  //     await browser.wait(ExpectedConditions.elementToBeClickable(page.resourceBtn));
  //     await page.resourceBtn.click();
  //     const btn = page.dialogOkBtn;
  //     if (await btn.isPresent()) {
  //       await btn.click();
  //     }
  //     await page.pdeRecipeEditor.isPresent();
  //   });
  // });
});
