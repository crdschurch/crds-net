import { ContentfulElementValidator as Element } from '../../Contentful/ContentfulElementValidator';
import { PromoManager } from '../../Contentful/Models/PromoModel';

function numberOfCardsShouldBeDisplayed(displayedCards, count) {
  displayedCards.then($cardList => {
    expect($cardList).lengthOf(count);
  });
}

function promoShouldMatchContent(displayedCard, promo) {
  displayedCard.find('.card-title').as('title');
  Element.shouldMatchSubsetOfText('title', promo.title);
}

function selectFilter(audience) {
  cy.get('[data-automation-id="happenings-dropdown"]').as('promoFilter');
  cy.get('@promoFilter').click();
  cy.get('@promoFilter').find(`[data-filter-select="${audience}"]`).click();
}

describe('Given I have not applied a filter to the Happenings section on the Homepage:', function () {
  let promoManager;
  const audience = 'Churchwide';
  before(function () {
    promoManager = new PromoManager();
    promoManager.savePromosInAudience(audience);
    promoManager.saveTargetAudiences();

    cy.visit('/');
  });

  it('The "Churchwide" filter should be selected by default', function () {
    cy.get('[data-automation-id="happenings-dropdown"]').find('[data-current-label]').as('currentFilter');
    cy.get('@currentFilter').should('have.text', 'Churchwide');
  });

  it('Only the "Churchwide" promos should be displayed and sorted by date then title', function () {
    cy.get(`[data-automation-id="happenings-cards"] > [data-filter*="${audience}"]`).as('churchwideCards');

    const churchwidePromos = promoManager.getSortedPromosInAudience(audience);
    numberOfCardsShouldBeDisplayed(cy.get('@churchwideCards'), churchwidePromos.length);
    churchwidePromos.forEach(($promo, $i) => {
      promoShouldMatchContent(cy.get('@churchwideCards').eq($i), $promo);
    });
  });

  it('The filter list should include every Target Audience on published promos', function () {
    const audienceCount = promoManager.targetAudiences.length;
    expect(audienceCount).to.be.above(0);

    cy.get('[data-automation-id="happenings-dropdown"]').as('happeningsFilter')
      .find('[data-filter-select]').then($audienceList => {
        expect($audienceList).lengthOf(audienceCount);
      });

    promoManager.targetAudiences.forEach(a => {
      cy.get('@happeningsFilter').find(`[data-filter-select="${a}"]`).should('exist');
    });
  });
});

describe('Given I want to filter the Happenings section on the Homepage:', function () {
  let promoManager;
  const audience = 'Oakley';

  before(function () {
    promoManager = new PromoManager();
    promoManager.savePromosInAudience(audience);
    cy.visit('/');
  });

  it('Then filtering by "Oakley" should display only Oakley promos sorted by date then title', function () {
    selectFilter(audience);

    cy.get(`[data-automation-id="happenings-cards"] > [data-filter*="${audience}"]`).as('oakleyCards');
    const sortedPromos = promoManager.getSortedPromosInAudience(audience);

    numberOfCardsShouldBeDisplayed(cy.get('@oakleyCards'), sortedPromos.length);
    sortedPromos.forEach(($promo, $i) => {
      promoShouldMatchContent(cy.get('@oakleyCards').eq($i), $promo);
    });
  });
});