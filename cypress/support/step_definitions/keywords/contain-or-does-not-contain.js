import * as selectors from '../mappings-importer';

Given(
  'the field {string} should contain {string} tag',
  (elementSelector, assertionValue) => {
    cy.get(selectors[elementSelector] || elementSelector).each(
      (elementSelector) => {
        expect(elementSelector).to.have.attr(assertionValue);
      }
    );
  }
);
