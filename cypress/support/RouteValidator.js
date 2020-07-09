//TODO depricate this
export class RouteValidator{
  static pageShouldNotBe404() {
    cy.get('[data-automation-id="404-search-field"]').as('404SearchField').should('not.exist');
  }

  static pageFoundAndURLMatches(url) {
    RouteValidator.pageShouldMatchUrl(url);
    RouteValidator.pageShouldNotBe404();
  }

  static pageShouldMatchUrl(url){
    cy.url().then(pageUrl => {
      const noTrailinSlashRegex = /\/$/g;
      expect(pageUrl.replace(noTrailinSlashRegex, '')).to.eq(url.replace(noTrailinSlashRegex, ''));
    });
  }
}