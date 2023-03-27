Given('the title of the page should contains {string}', (title) => {
  cy.title().should('eq', title);
});
