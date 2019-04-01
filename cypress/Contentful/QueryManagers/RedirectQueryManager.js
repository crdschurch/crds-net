import { ContentfulLibrary } from 'crds-cypress-tools';

export class RedirectQueryManager {
  fetchRedirectFrom(fromSlug) {
    this._query_result = undefined;
    const redirect = ContentfulLibrary.query.entryList(`${this._requiredQueryParameters}&select=fields.from,fields.to&fields.from=${fromSlug}`, false);
    return cy.wrap({ redirect }).its('redirect.responseReady').should('be.true').then(() => {
      const firstRedirect = redirect.responseBody.items[0];
      if (firstRedirect !== undefined)
        this._query_result = new ContentfulLibrary.entry.redirect(firstRedirect);
    });
  }
  get queryResult() {
    return this._query_result;
  }
  get _requiredQueryParameters() {
    return 'content_type=redirect';
  }
}