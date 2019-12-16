import { fred_flintstone } from '../../fixtures/test_users';

describe('Tests Happening section is displayed', function () {
  it('Checks happenings section exists for logged-out user', function () {
      cy.on('uncaught:exception', (err, runnable) => {
          return false
      })
      cy.visit('/');
    cy.get('crds-site-happenings').scrollIntoView({top: 100}).should('have.prop', 'shadowRoot').and('not.be.null');
  });

  it('Checks happenings section exists for logged-in user', function () {
      cy.login(fred_flintstone.email, fred_flintstone.password);
      cy.on('uncaught:exception', (err, runnable) => {
          return false
      })
    cy.visit('/');

    cy.get('crds-site-happenings').scrollIntoView({top: 100}).should('have.prop', 'shadowRoot').and('not.be.null');
  });
});