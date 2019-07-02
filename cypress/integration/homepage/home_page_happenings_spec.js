import { ContentfulLibrary } from 'crds-cypress-tools';
import { target_audiences } from '../../fixtures/target_audiences';

function promoShouldMatchContent(displayedCard, promo) {
  displayedCard.find('.card-title').as('title');
  cy.get('@title').text().should('contain', promo.title.text);
}

function selectFilter(audience) {
  cy.get('[data-automation-id="happenings-dropdown"]').as('promoFilter');
  cy.get('@promoFilter').scrollIntoView().click();

  cy.get('@promoFilter').find(`[data-filter-select="${audience}"]`).as('audienceSelector');
  cy.get('@audienceSelector').click();
}

describe('Tests Happening section without filters', function () {
  before(function () {
    cy.ignoreUncaughtException('Cannot read property \'reload\' of undefined'); //Remove once DE6613 is fixed
    cy.visit('/');
  });

  beforeEach(function () {
    cy.get('[data-automation-id="happenings-dropdown"]').as('promoFilter');
    cy.get('@promoFilter').scrollIntoView();
  });

  it('The "Churchwide" filter should be selected by default', function () {
    cy.get('@promoFilter').find('[data-current-label]').as('currentFilter');
    cy.get('@currentFilter').should('have.text', 'Churchwide');
  });
});

describe('Tests Happenings can be filtered by audience', function () {
  let pqm;
  before(function () {
    cy.ignoreUncaughtException('Cannot read property \'reload\' of undefined'); //Remove once DE6613 is fixed
    cy.visit('/');
    cy.hideSharedHeader();
    pqm = new ContentfulLibrary.queryManager.promoQueryManager();
  });

  target_audiences.forEach(audience => {
    it(`Filtering by "${audience}" should display only ${audience} promos sorted by date then title`, function () {
      const promosForAudienceQuery = `${pqm.query.forAudience(audience)}&${pqm.query.orderBy.publishedMostRecentlyThenTitle}`;
      pqm.fetchListOfEntries(promosForAudienceQuery, 1000).then(promos => {
        if (promos.length == 0) {
          cy.log(`There are no published promos for "${audience}"`);
        } else {
          cy.get('[data-automation-id="happenings-dropdown"]').as('promoFilter');
          cy.get('@promoFilter').scrollIntoView();

          cy.get('@promoFilter').find(`[data-filter-select="${audience}"]`).should('exist');
          selectFilter(audience);

          cy.get('[data-automation-id="happenings-cards"] > [style="display: block;"]').as(`${audience}Cards`);
          cy.get(`@${audience}Cards`).should('have.length', promos.length);
          promos.forEach((promo, i) => {
            promoShouldMatchContent(cy.get(`@${audience}Cards`).eq(i), promo);
          });
        }
      });
    });
  });
});