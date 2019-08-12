import { PromoQueryManager } from 'crds-cypress-contentful';
import { fred_flintstone, sherlock_holmes } from '../../fixtures/test_users';

describe('Tests Happening section for user with site selected', function () {
  let loadStatus = {};
  let pqm = new PromoQueryManager();
  before(function () {
    cy.login(fred_flintstone.email, fred_flintstone.password);
    cy.visit('/', {
      onBeforeLoad: (win) => {
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

  it(`Checks the user's site "${fred_flintstone.congregation}" is selected`, function () {
    cy.get('@happeningsRoot').should('have.prop', 'shadowRoot').then(root => {
      const happeningsFilter = root.querySelector('[data-automation-id="happenings-filter"]');
      const selector = happeningsFilter.querySelector('select');
      expect(selector.value).to.eq(fred_flintstone.congregation, 'User\'s congregation should be selected');

      const siteLabel = happeningsFilter.querySelector('.my-site-label');
      expect(siteLabel.textContent).to.eq('(my site)', 'My Site indicator should be displayed');
    });
  });

  it(`Checks the "${fred_flintstone.congregation}" promos are displayed`, function () {
    const promosQuery = `${pqm.query.forAudience(fred_flintstone.congregation)}&${pqm.query.orderBy.publishedMostRecentlyThenTitle}`;
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
});

describe('Tests Happening section for user without site', function () {
  let loadStatus = {};
  before(function () {
    cy.login(sherlock_holmes.email, sherlock_holmes.password);
    cy.visit('/', {
      onBeforeLoad: (win) => {
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

  it('Checks the site select message is displayed', function () {
    cy.get('@happeningsRoot').should('have.prop', 'shadowRoot').then(root => {
      const selector = root.querySelector('[data-automation-id="happenings-choose-site"]').querySelector('select');
      expect(selector.value).to.eq('Choose a site');
    });
  });

  it('Checks site select message can be closed without selecting a site', function () {
    cy.get('@happeningsRoot').should('have.prop', 'shadowRoot').then(root => {
      root.querySelector('.site-select-message').querySelector('.close').click();

      const selector = root.querySelector('[data-automation-id="happenings-filter"]').querySelector('select');
      expect(selector.value).to.eq('Churchwide', 'Churchwide filter should be applied');
    });
  });
});