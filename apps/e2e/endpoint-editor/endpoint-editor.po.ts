import { $, $$, element, by } from 'protractor';

import { getParameterBye2eTag } from '../util/selector-functions';

// Navigation steps
export const integrationBandsStep = $$('.mat-step-label').get(0);
export const basisFunctionStep = $$('.mat-step-label').get(1);
export const algorithmsStep = $$('.mat-step-label').get(2);
export const settingsStep = $$('.mat-step-label').get(3);

// Buttons elements
export const discardChangesBtn = $('[e2e = discardChangesBtn]');
export const acceptChangesBtn = $('[e2e = acceptChangesBtn]');
export const viewnkFilesBtn = $('[e2e= viewNKFiles]');
export const applyParametersIBBtn = getParameterBye2eTag('filterIBParameters', 'applyBtn');
export const cancelParametersIBBtn = getParameterBye2eTag('filterIBParameters', 'cancelBtn');
export const applyParametersBFBtn = getParameterBye2eTag('filterBFParameters', 'applyBtn');
export const cancelParametersBFBtn = getParameterBye2eTag('filterBFParameters', 'cancelBtn');
export const applyParametersAlgothmBtn = getParameterBye2eTag('algorithmParameters', 'applyBtn');
export const cancelParametersAlgthmBtn = getParameterBye2eTag('algorithmParameters', 'cancelBtn');

// Endpoint Editor selectors
export const commentOES = $('[e2e = OESComment]');

// Algorithms Stage Execution modes
export const sequentialRadioBtn = $('[e2e = Sequential]');
export const parallelORRadioBtn = $('[e2e = ParallelOR]');
export const parallelANDRadioBtn = $('[e2e = ParallelAND]');

// Filter Icon Elements - Create
export const iconIBCreate = element(by.cssContainingText('[aria-posinset="1"]', 'create'));
export const iconBasicFunctionsCreate = element(
  by.cssContainingText('[aria-posinset="2"]', 'create'),
);
export const iconAlgorithmsCreate = element(by.cssContainingText('[aria-posinset="3"]', 'create'));
export const iconSettingsCreate = element(by.cssContainingText('[aria-posinset="4"]', 'create'));

// Filter Icon Elements - Warning
export const iconIBWarning = element(by.cssContainingText('[aria-posinset="1"]', 'warning'));
export const iconBasicFunctionsWarning = element(
  by.cssContainingText('[aria-posinset="2"]', 'warning'),
);
export const iconAlgorithmsWarning = element(
  by.cssContainingText('[aria-posinset="3"]', 'warning'),
);
export const iconSettingsWarning = element(by.cssContainingText('[aria-posinset="4"]', 'warning'));

// Filter Icon Elements - Done
export const iconIBDone = element(by.cssContainingText('[aria-posinset="1"]', 'done'));
export const iconBasicFunctionsDone = element(by.cssContainingText('[aria-posinset="2"]', 'done'));
export const iconAlgorithmsDone = element(by.cssContainingText('[aria-posinset="3"]', 'done'));
export const iconSettingsDone = element(by.cssContainingText('[aria-posinset="4"]', 'done'));

// Filter error elements containing string.
export const errorNegativeInteger = element(
  by.cssContainingText('.mat-error', 'Must be a nonnegative integer'),
);
export const errorNegativeNumber = element(
  by.cssContainingText('.mat-error', 'Must be a nonnegative number'),
);

export const hintOk = element(by.cssContainingText('.mat-hint', 'OK'));

// ag grid elements
export const agBFInput = $('.ag-popup-editor').$('.mat-input-element');

// parameter filter elements
export const filterIBParameters = $('[e2e=filterIBParameters]');
export const filterBFParameters = $('[e2e=filterBFParameters]');
export const signalChannelFilterList = $('[e2e=signalChannelFilterList]');

// IB Parameters List
export const filterTypeIB = getParameterBye2eTag('filterIBParameters', 'filterType');
export const hiCutoffFreqIB = getParameterBye2eTag('filterIBParameters', 'hiCutoffFreq');
export const loCurOffFreqIB = getParameterBye2eTag('filterIBParameters', 'loCutoffFreq');
export const coefficientIB = getParameterBye2eTag('filterIBParameters', 'coefficient');
export const numSamplesIB = getParameterBye2eTag('filterIBParameters', 'numSamples');

// BF Parameters List
export const filterTypeBF = getParameterBye2eTag('filterBFParameters', 'filterType');
export const hiCutoffFreqBF = getParameterBye2eTag('filterBFParameters', 'hiCutoffFreq');
export const loCurOffFreqBF = getParameterBye2eTag('filterBFParameters', 'loCutoffFreq');
export const numSamplesBF = getParameterBye2eTag('filterBFParameters', 'numSamples');

// Algorithm Parameters List
export const algorithmList = getParameterBye2eTag('algorithmParameters', 'algorithm');
export const commentAlgorithm = getParameterBye2eTag('algorithmParameters', 'comment');
export const normalizationTimeAlgorithm = getParameterBye2eTag(
  'algorithmParameters', 'normTime');
