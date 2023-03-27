import * as selectors from '../../step_definitions/mappings-importer';

let selectedProduct;
let totalCost;

beforeEach(() => {
  selectedProduct = [];
  totalCost = 0;
});

Given('the user search for {string}', (value) => {
  // search for product and click search button
  cy.get(selectors.search_input_field)
    .should('be.visible')
    .type(`${value}{enter}`); // Using Enter key to test accessibility

  // filter search results that has prime delivery
  cy.get(selectors.search_result_component)
    .should('be.visible')
    .not(selectors.sponsored_result)
    .filter(`:has(${selectors.prime_icon})`)
    .each(($el, index) => {
      if (index <= 2) {
        cy.get($el).within(() => {
          // extract product url and add it to a list
          cy.getHref(selectors.search_result_component_image).then((href) => {
            // add the selected product to a list
            selectedProduct.push({ url: href });
          });
        });
      }
    });
});

Given(
  'the user add the first 3 results that qualify for Prime delivery',
  () => {
    // loop thought the selected products and add it to basket
    for (const product of selectedProduct) {
      // visit page
      cy.visit(product);
      // click on add to basket button
      cy.clickElement(selectors.add_to_cart_btn);
      // if product contains warranty then decline warranty
      cy.get('body').then((body) => {
        if (body.find(selectors.warranty_panel).length > 0) {
          cy.clickElement(selectors.decline_warranty_plan_btn);
          cy.clickElement(selectors.clone_warranty_plan_btn);
        }
      });
    }
    cy.clickElement(selectors.nav_basket_btn);
  }
);

Given('the user modify the quanity of one item', () => {
  // change the quantity of the first product from the basket
  cy.get('#quantity:first')
    .should('be.visible')
    .focus()
    .select(2, { force: true })
    .should('have.value', '2');

  // make sure there is three products in the basket and extract the cost
  cy.get(selectors.basket_item_list)
    .should('be.visible')
    .and('have.length', 3)
    .each((el, index) => {
      cy.get(el)
        .invoke('attr', 'data-price')
        .then(
          (price) =>
            (totalCost += index === 0 ? Number(price) * 2 : Number(price))
        );
    });
});

Given('the total value is correct', () => {
  // check the total cost off product
  cy.wait(2000);
  cy.get(selectors.basket_total_price)
    .should('be.visible')
    .contains(
      `Subtotal (4 items): ${totalCost.toLocaleString('en-US', {
        style: 'currency',
        currency: 'GBP',
      })}`
    );
});
