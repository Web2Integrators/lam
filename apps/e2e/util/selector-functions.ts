import { $, $$, element, by } from 'protractor';

/**
 * Returns a cell from the grid with the given rowId and position
 * positions are shifted to start at one
 * @param {string} rowId The row-id of cell that should be returned
 * @param {string} colId The col-id of cell that should be returned
 */
export function getAgCell(rowId: string, colId: string) {
  return $$('.ag-body-container')
    .first()
    .$('[row-id = ' + rowId + ']')
    .$$('[col-id^="' + colId + '"]')
    .first();
}

/**
 * Returns a cell from a given grid with the given rowId and position
 * positions are shifted to start at one
 * @param {string} agGroup e2e tag of ag Group
 * @param {string} rowId The row-id of cell that should be returned
 * @param {string} colId The col-id of cell that should be returned
 */
export function getAgCellbyAgGroup(agGroup: string, rowId: string, colId: string) {
  return $('[e2e = ' + agGroup + ']')
    .$$('.ag-body-container')
    .first()
    .$('[row-id = ' + rowId + ']')
    .$$('[col-id^="' + colId + '"]')
    .first();
}

export function getAGAlgorithm() {
  return $('[e2e = algorithmsGroup]')
    .$$('.ag-body-container')
    .first()
    .$('[row-id = "Stage 1"]')
    .$$('[col-id^="algorithm"]')
    .first();
}

/**
 * Returns a cell from a given grid that has .invalid class
 * @param {string} agGroup e2e tag of ag Group
 */
export function getAgInvalidCellbyAgGroup(agGroup: string) {
  return $('[e2e = ' + agGroup + ']')
    .$('.invalid');
}

/**
 * Returns a cell from a given grid that has .mat-error class
 * @param {string} agGroup e2e tag of ag Group
 */
export function getMatErrorElementbyAgGroup(agGroup: string) {
  return $('[e2e = ' + agGroup + ']')
    .$('.mat-error');
}

/**
 * Returns a cell from a given grid that has .mat-error class
 * @param {string} agGroup e2e tag of ag Group
 */
export function getMatCardElementbyAgGroup(agGroup: string) {
  return $('[e2e = ' + agGroup + ']')
    .$('.mat-card');
}

/**
 * Returns a cell from a given grid with the given parameter dropdown list name
 * based on e2e tag
 * @param {string} parameterGroup e2e tag of ag Group
 * @param {string} parameterName e2e tag of the parameter name
 */
export function getParameterBye2eTag(parameterGroup: string, parameterName: string) {
  return $('[e2e = ' + parameterGroup + ']')
    .$('.mat-card')
    .$('[e2e^="' + parameterName + '"]');
}

/**
 * Returns an element from the grid with the given position
 * @param {number} headerPosition header position
 */
export function getAgHeaderCell(headerPosition: number) {
  return $('.ag-header-container')
    .$$('.ag-header-row')
    .get(0)
    .$$('.ag-header-cell')
    .get(headerPosition);
}

/**
 * Returns an element from the grid with the given string
 * @param {string} value string value
 */
export function getAgCellEditInputOption(value: string) {
  return $('[ value = "' + value + '"]');
}

/**
 * Returns an element that matches a css element containing text
 * @param {string} cssClass class text of the matching element
 * @param {string} content content in string format of regular expression of the matching element.
 */
export function cssElementContainingText(cssClass: string, content: string | RegExp) {
  return element(by.cssContainingText(cssClass, content));
}
