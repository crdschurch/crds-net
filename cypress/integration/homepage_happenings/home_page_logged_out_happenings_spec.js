import { PromoQueryManager } from 'crds-cypress-contentful';

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
});