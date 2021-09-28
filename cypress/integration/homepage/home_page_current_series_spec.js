import { SeriesQueryBuilder} from 'crds-cypress-contentful';

const errorsToIgnore =  /.* > Cannot read property 'getAttribute' of null*/;
describe('Testing the Current Series on the Homepage:', function() {
  let currentSeries;
  before(function() {
    const qb = new SeriesQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.title,fields.slug,fields.description,fields.image';
    cy.task('getCNFLResource', qb.queryParams)
      .then((series) => {
        currentSeries = series;
      });
    cy.ignoreMatchingErrors(errorsToIgnore);
    cy.visit('/');
  });
 
  it('Current series title, description, and image should match Contentful', function() {
    cy.get('[data-automation-id="series-title"]').as('seriesTitle')
      .should('be.visible')
      .and('have.text', currentSeries.title.text);
    cy.get('@seriesTitle')
      .should('have.attr', 'href', `/media/series/${currentSeries.slug.text}`);
    cy.get('crds-button', { includeShadowDom: true })
      .should('be.visible')
      .should('have.attr', 'text', 'Take the 30 day challenge');

    cy.get('[data-automation-id="series-image"]').as('seriesImageLink')
      .scrollIntoView()
      .should('have.attr', 'href', `/media/series/${currentSeries.slug.text}`)
      .within(() => {
        cy.imgixShouldRunOnElement('img', currentSeries.image);
      });
  });
  it('"Watch current teaching series" button should link to the current series', function() {
    cy.get('[class="media featured"]').scrollIntoView();
    cy.get('crds-button[text="Watch the current teaching series"]')
      .as('watchServiceButton')
      .should('be.visible')
      .and('have.attr', 'href', `/media/series/${currentSeries.slug.text}`);
  });
});