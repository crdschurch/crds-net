import { ContentfulElementValidator as Element } from '../../Contentful/ContentfulElementValidator';
import { SeriesManager } from '../../Contentful/Models/SeriesModel';

describe('Tesing the Current Series on the Media/Series page:', function () {
  let currentSeries;
  before(function () {
    const seriesManager = new SeriesManager();
    seriesManager.saveCurrentSeries();
    cy.wrap({ seriesManager }).its('seriesManager.currentSeries').should('not.be.undefined').then(() => {
      currentSeries = seriesManager.currentSeries;
    });
    cy.visit(`${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series`);
  });

  it('The Current series title, date range, and description should match Contentful', function () {
    cy.get('.current-series').as('currentSeriesBlock');

    cy.get('@currentSeriesBlock').find('h1').as('currentSeriesTitle');
    cy.get('@currentSeriesTitle').should('be.visible').and('contain', currentSeries.title.text);

    const start = currentSeries.startDate.ignoreTimeZone().toString();
    const end = currentSeries.endDate.ignoreTimeZone().toString();

    cy.get('@currentSeriesBlock').find('date').as('currentSeriesDateRange');
    cy.get('@currentSeriesDateRange').should('be.visible').and('contain', `${start} — ${end}`);

    cy.get('@currentSeriesBlock').find('div.col-xs-12.col-md-5 > div').as('currentSeriesDescription');
    Element.shouldContainText('currentSeriesDescription', currentSeries.description);
  });

  it('The current series image and image link should match Contentful', function () {
    cy.get('.current-series').as('currentSeries');
    cy.get('@currentSeries').find('a').should('have.attr', 'href', currentSeries.relativeUrl);

    Element.shouldHaveImgixImageFindImg('currentSeries', currentSeries.image);
  });

  it('"View the series" button should link to the current series', function () {
    cy.contains('View the series').as('viewSeriesButton');
    cy.get('@viewSeriesButton').should('be.visible').and('have.attr', 'href', currentSeries.relativeUrl);
  });
});
