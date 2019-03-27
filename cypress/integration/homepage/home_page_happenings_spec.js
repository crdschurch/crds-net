import { PromoQueryManager } from '../../Contentful/QueryManagers/PromoQueryManager';

function promoShouldMatchContent(displayedCard, promo) {
  displayedCard.find('.card-title').as('title');
  cy.get('@title').normalizedText().then(elementText => {
    expect(promo.title.text).to.contain(elementText);
  });
}

function selectFilter(audience) {
  cy.get('[data-automation-id="happenings-dropdown"]').as('promoFilter');
  cy.get('@promoFilter').scrollIntoView().click();
  cy.get('@promoFilter').find(`[data-filter-select="${audience}"]`).click();
}

describe('Given I have not applied a filter to the Happenings section on the Homepage:', function () {
  before(function () {
    cy.visit('/');
  });

  it('The "Churchwide" filter should be selected by default', function () {
    cy.get('[data-automation-id="happenings-dropdown"]').find('[data-current-label]').as('currentFilter');
    cy.get('@currentFilter').should('have.text', 'Churchwide');
  });

  it('Only the "Churchwide" promos should be displayed and sorted by date then title', function () {
    const audience = 'Churchwide';

    cy.get(`[data-automation-id="happenings-cards"] > [data-filter*="${audience}"]`).as('churchwideCards');

    const pm = new PromoQueryManager();
    pm.fetchPromosByAudience(audience).then(() => {
      const churchwidePromos = pm.queryResult;
      cy.get('@churchwideCards').should('have.length', churchwidePromos.length);

      churchwidePromos.forEach(($promo, $i) => {
        promoShouldMatchContent(cy.get('@churchwideCards').eq($i), $promo);
      });
    });
  });

  it('The filter list should include every Target Audience on published promos', function () {
    const pm = new PromoQueryManager();
    pm.fetchAudiencesOnPromos().then(() => {
      const audiences = pm.queryResult;

      expect(audiences.length).to.be.above(0);
      cy.get('[data-automation-id="happenings-dropdown"]').as('happeningsFilter')
        .find('[data-filter-select]').should('have.length', audiences.length);

      audiences.forEach(a => {
        cy.get('@happeningsFilter').find(`[data-filter-select="${a}"]`).should('exist');
      });
    });
  });
});

describe('Given I want to filter the Happenings section on the Homepage:', function () {
  const audience = 'Oakley';

  before(function () {
    cy.visit('/');
  });

  it(`Then filtering by "${audience}" should display only ${audience} promos sorted by date then title`, function () {
    selectFilter(audience);

    cy.get(`[data-automation-id="happenings-cards"] > [data-filter*="${audience}"]`).as('locationCards');
    const pm = new PromoQueryManager();
    pm.fetchPromosByAudience(audience).then(() => {
      const locationPromos = pm.queryResult;
      cy.get('@locationCards').should('have.length', locationPromos.length);

      locationPromos.forEach(($promo, $i) => {
        promoShouldMatchContent(cy.get('@locationCards').eq($i), $promo);
      });
    });
  });
});