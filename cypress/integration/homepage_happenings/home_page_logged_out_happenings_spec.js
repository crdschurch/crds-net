import { PromoQueryManager } from 'crds-cypress-contentful';
import { ExtendedPromoEntry } from "../../Contentful/ExtendedPromoEntry";
import { Formatter } from '../../support/Formatter';

describe('Tests Happening section with default filter', function () {
  const defaultAudience = 'Churchwide';
  let loadStatus = {};
  let pqm = new PromoQueryManager();

  before(function () {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        loadStatus.site_happenings_loaded = false;
        win.document.addEventListener('component rendered', () => {
          loadStatus.site_happenings_loaded = true;
        });
      }
    });
  });

  beforeEach(function () {
    cy.wrap(loadStatus).its('site_happenings_loaded').should('be.true').then(() => {
      cy.get('crds-site-happenings').as('happeningsRoot');
      cy.get('@happeningsRoot').scrollIntoView();
    });
  });

  it(`Checks the default audience "${defaultAudience}" filter should be selected`, function () {
    cy.get('@happeningsRoot').should('have.prop', 'shadowRoot').then(root => {
      const happeningsFilter = root.querySelector('[data-automation-id="happenings-filter"]');
      const selector = happeningsFilter.querySelector('select');
      expect(selector.value).to.eq(defaultAudience, `"${defaultAudience}" should be selected`);
    });
  });

  it(`Checks the "${defaultAudience}" promos are displayed`, function () {
    const promosQuery = `${pqm.query.forAudience(defaultAudience)}`;
    pqm.getListOfEntries(promosQuery).then(promos => {

      cy.get('@happeningsRoot').should('have.prop', 'shadowRoot').then(root => {
        const cards = root.querySelector('[data-automation-id="happenings-cards"]').querySelectorAll('.card-title');
        const cardTitles = [];
        cards.forEach(c => cardTitles.push(c.textContent));

        const promoTitles = promos.map(p => p.title.text);

        expect(promoTitles.length).to.eq(cardTitles.length);
        expect(promoTitles.sort()).to.deep.equal(cardTitles.sort());
      });
    });
  });

  it('Checks audience with no promos should not be in dropdown', function () {
    const audience = 'Fake audience';
    const promosQuery = `${pqm.query.forAudience(audience)}`;

    pqm.getListOfEntries(promosQuery).then(promos => {
      expect(promos.length).to.eq(0);

      cy.get('@happeningsRoot').should('have.prop', 'shadowRoot').then(root => {
        const selector = root.querySelector('[data-automation-id="happenings-filter"]').querySelector(`option[value="${audience}"]`);
        expect(selector).to.eq.null;
      });
    });
  });

  it('Checks promo cards have expected compomenents', function() {
    cy.get('@happeningsRoot').should('have.prop', 'shadowRoot').then(root => {
      const firstCard = root.querySelector('[data-automation-id="happenings-cards"]').querySelector('.card');
      const imageBlock = firstCard.querySelector('a[class="relative"]');
      const cardHref = imageBlock.href;

      const promosQuery = `fields.link_url=${cardHref}`;
      pqm.entryConstructor = ExtendedPromoEntry;
      pqm.getListOfEntries(promosQuery).then(promos => {
        const firstPromo = promos[0];

        expect(cardHref).to.eq(firstPromo.linkURL.text);

        const imageElement = imageBlock.querySelector('img');
        expect(imageElement.alt).to.eq(firstPromo.title.text);
        expect(imageElement.src).to.include(firstPromo.imageLink.id);

        const textBlock = firstCard.querySelector('.card-title > a');
        expect(textBlock.href).to.eq(firstPromo.linkURL.text);
        expect(textBlock.textContent).to.eq(firstPromo.title.text);

        const cardText = firstCard.querySelector('.card-text');
        expect(Formatter.normalizeText(cardText.innerHTML)).to.eq(firstPromo.description.unformattedText);
      });
    });
  });
});