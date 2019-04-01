import { ContentfulLibrary } from 'crds-cypress-tools';

export class PromoQueryManager {
  /**
   * Warning! Published promos are only displayed if their published_at date has passed
   */
  fetchPromosByAudience(audience) {
    this._query_result = [];
    const promoList = ContentfulLibrary.query.entryList(`${this._requiredQueryParameters}&select=fields.title,fields.target_audience,fields.published_at&order=-fields.published_at,fields.title`);
    return cy.wrap({ promoList }).its('promoList.responseReady').should('be.true').then(() => {
      const promosWAudience = promoList.responseBody.items.filter(r => {
        return r.fields !== undefined && r.fields.target_audience !== undefined;
      });
      for (let i = 0; i < promosWAudience.length; i++) {
        let response = promosWAudience[i];
        if (response.fields.target_audience.includes(audience)) {
          let promo = new ContentfulLibrary.entry.promo(response);
          this._query_result.push(promo);
        }
      }
    });
  }
  fetchAudiencesOnPromos() {
    this._query_result = [];
    const promoList = ContentfulLibrary.query.entryList(`${this._requiredQueryParameters}&select=fields.target_audience`);
    return cy.wrap({ promoList }).its('promoList.responseReady').should('be.true').then(() => {
      const audiences = {};
      const promosWAudience = promoList.responseBody.items.filter(r => {
        return r.fields !== undefined && r.fields.target_audience !== undefined;
      });
      for (let i = 0; i < promosWAudience.length; i++) {
        let targetAudiences = promosWAudience[i].fields.target_audience;
        for (let i = 0; i < targetAudiences.length; i++)
          audiences[targetAudiences[i]] = undefined;
      }
      this._query_result = Object.keys(audiences).sort();
    });
  }

  get queryResult() {
    return this._query_result;
  }

  get _requiredQueryParameters() {
    const now = Cypress.moment(Date.now()).utc().format();
    return `content_type=promo&fields.published_at[lte]=${now}`;
  }
}