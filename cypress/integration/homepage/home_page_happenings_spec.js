import { PromoQueryManager } from '../../Contentful/QueryManagers/PromoQueryManager';

function promoShouldMatchContent(displayedCard, promo) {
  displayedCard.find('.card-title').as('title');
  cy.get('@title').text().should('contain', promo.title.text);
}

function selectFilter(audience) {
  cy.get('[data-automation-id="happenings-dropdown"]').as('promoFilter');
  cy.get('@promoFilter').scrollIntoView().click();
  cy.get('@promoFilter').find(`[data-filter-select="${audience}"]`).click();
}

describe('Given I have not applied a filter to the Happenings section on the Homepage:', function () {
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

  it('The filter list should include every Target Audience on published promos', function () {
    const pm = new PromoQueryManager();
    pm.fetchAudiencesOnPromos().then(() => {
      const audiences = pm.queryResult;

      expect(audiences.length).to.be.above(0);
      cy.get('@promoFilter').find('[data-filter-select]').should('have.length', audiences.length);

      audiences.forEach(a => {
        cy.get('@promoFilter').find(`[data-filter-select="${a}"]`).should('exist');
      });
    });
  });
});

describe('Given I want to filter the Happenings section on the Homepage:', function () {
  before(function () {
    cy.ignoreUncaughtException('Cannot read property \'reload\' of undefined'); //Remove once DE6613 is fixed
    cy.visit('/');
  });

  ['Churchwide', 'Oakley'].forEach(audience => {
    it(`Filtering by "${audience}" should display only ${audience} promos sorted by date then title`, function () {
      const pm = new PromoQueryManager();
      pm.fetchPromosByAudience(audience).then(() => {
        const promos = pm.queryResult;
        expect(promos.length).to.be.above(0);
        return promos;
      }).then(expectedPromos => {
        selectFilter(audience);

        cy.get(`[data-automation-id="happenings-cards"] > [data-filter*="${audience}"]`).as(`${audience}Cards`);

        cy.get(`@${audience}Cards`).should('have.length', expectedPromos.length);
        expectedPromos.forEach(($promo, $i) => {
          promoShouldMatchContent(cy.get(`@${audience}Cards`).eq($i), $promo);
        });
      });
    });
  });
});