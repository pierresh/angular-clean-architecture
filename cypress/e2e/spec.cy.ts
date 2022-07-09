describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');

    // Given I have content in ticket name
    cy.get('input[name="name"]').type('2');

    // When I click on button new
    cy.get('button[data-cy="button-new"]').click();

    // Then the ticket name should be empty
    cy.get('input[name="name"]').should('have.value', '');

    /** Test button Save - Create **/
    // Given I have content in ticket name
    cy.get('input[name="name"]').type('New ticket');

    // When I click on save
    cy.get('button[data-cy="button-save"]').click();

    // Then I should get a new ticket id
    cy.get('input[name="id"]').should('have.value', 3);

    // It should have 3 tiles
    cy.get('div[data-cy="tiles"] a').should('have.length', 3);

    /** Test button Save - Update **/
    // Give I update the ticket name
    cy.get('input[name="name"]').type('New ticket updated');

    // When I click on save
    cy.get('button[data-cy="button-save"]').click();

    // Then it should still have 3 tiles
    cy.get('div[data-cy="tiles"] a').should('have.length', 3);

    /** Test button Delete **/
    // When I click on delete
    cy.get('button[data-cy="button-delete"]').click();

    // Then it should still have 2 tiles
    cy.get('div[data-cy="tiles"] a').should('have.length', 2);
  });
});
