export class RouteValidator{
  static pageShouldBeFromNetlify() {
    cy.get('meta[name="Netlify"]').as('NetlifyMetadata').should('exist');
  }

  static pageShouldNotBe404() {
    cy.get('[data-automation-id="404-search-field"]').as('404SearchField').should('not.exist');
  }

  static pageFoundAndFromNetlify(url) {
    cy.url().should('eq', url);
    RouteValidator.pageShouldNotBe404();
    RouteValidator.pageShouldBeFromNetlify();
  }

  static responseShouldNotBeFromMaestro(response){
    expect(response.headers['x-varnish']).not.to.exist;

    if(response.headers.via != undefined){
      expect(response.headers.via).not.to.contain('varnish');
    }

    expect(response.body).not.to.contain('meta name="Maestro"');
  }

  static responseShouldBeFromNetlify(response){
    expect(response.body).to.contain('meta name="Netlify"');
  }
}