export class ProfileMenu {
  /**
   * Programmatically expands the profile menu (iff user is signed in)
   */
  forceOpen() {
    cy.get('#crds-shared-header-desktop-toggle').find('.profile-picture').as('myProfileIcon');
    cy.get('@myProfileIcon').should('be.visible');

    cy.get('#crds-shared-header-desktop-toggle').parent().as('myProfileMenu');
    cy.get('@myProfileMenu').invoke('attr', 'class').then(($classValues) => {
      let newClass = `${$classValues} open`;
      cy.get('@myProfileMenu').invoke('attr', 'class', newClass);
    });

    cy.get('#crds-shared-header-desktop-toggle').invoke('attr', 'aria-expanded', 'true');
  }

  clickLink(linkAlias){
    cy.get(`@${linkAlias}`).should('be.visible').and('have.attr', 'href').and('not.be.empty');
    cy.get(`@${linkAlias}`).click();
  }
}