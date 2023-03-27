import * as selectors from '../mappings-importer';

Given('the user clicks on {string}', (elementSelector) => {
  cy.get('body')
    .should('be.visible')
    .then((body) => {
      if (body.find(selectors[elementSelector]).length > 0) {
        cy.get(selectors[elementSelector]).should('be.visible').click();
      } else {
        cy.contains(elementSelector).click();
      }
    });
});
