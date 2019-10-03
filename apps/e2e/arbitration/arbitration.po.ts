import { browser, $, by, element } from 'protractor';

// Waiting Visual (contains the spinner)
export const waitingVisual = $('[e2e = waitingVisual ]');

// Elements from session page
export const toolIdInput = $('[e2e = toolIdInput]');
export const connectBtn = $('[e2e = connectBtn]');

// Elements from login page
export const login = $('[e2e = login]');
export const password = $('[e2e = password]');
export const loginBtn = $('[e2e = loginBtn]');

// Elements from connection wizard page
export const lamResourceLock = $('[e2e = lamResourceLock]');

// Elements from resource page
export const resourceBtn = element(by.buttonText(browser.params.resource));
export const dialogOkBtn = element(by.buttonText('OK'));
export const dialogDismissBtn = element(by.buttonText('Dismiss'));

// Warning message for session and login pages
export const warningMessage = $('[e2e = warning]');

// Top level recipe components
export const wfeEditor = $('[e2e = wfe]');
