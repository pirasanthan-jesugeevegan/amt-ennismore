Given('the url contains {string}', (assertionValue) => {
  cy.url().should('contain', Cypress.env(assertionValue) || assertionValue);
});

Given('the url does not contain {string}', (assertionValue) => {
  cy.url().should(
    'not.to.contain',
    Cypress.env(assertionValue) || assertionValue
  );
});
