export class RouteValidator{
  static pageShouldNotBe404() {
    cy.get('[data-automation-id="404-search-field"]').as('404SearchField').should('not.exist');
  }

  static pageFoundAndFromNetlify(url) {
    RouteValidator.pageShouldMatchUrl(url);
    RouteValidator.pageShouldNotBe404();
  }

  //Tailing slashes should be omitted, they'll be allowed in a successful match
  static pageShouldMatchUrl(url){
    const urlRegex = new RegExp(`${url}/?$`);
    cy.url().should('match', urlRegex);
  }
}