import { MessageQueryBuilder } from 'crds-cypress-contentful';
import { getRelativeMessageUrl } from '../../support/GetUrl';
import { getStreamSchedule } from '../../fixtures/stream_schedule_response';

describe('Tests the /live jumbotron content with different stream times:', function () {
  before(function () {
    //Ignore this error - unsure what to stub to avoid it
  const countdownConstructorError = [/.*CRDS.Countdown is not a constructor.*/, /.*> Cannot set property 'status' of undefined*/];
    cy.ignoreMatchingErrors([countdownConstructorError]);

    //Get current message
    const qb = new MessageQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.slug';
    cy.task('getCNFLResource', qb.queryParams)
      .then(getRelativeMessageUrl)
      .as('messageUrl');
  });

  describe.skip('Tests button navigation:', function () {
  const countdownConstructorError = [/.*> Cannot read property 'addEventListener' of null*/, /.*> Cannot set property 'status' of undefined*/];
    beforeEach(function () {
      
      cy.server();
    });

    it('Live Stream State: Checks clicking "Watch Now" navs to the live stream', function () {
      const fakeCurrentSchedule = getStreamSchedule(0);
      cy.route(`${Cypress.env('stream_schedule_env')}/streamSchedule`, fakeCurrentSchedule);
      cy.visit('/live');

      cy.get('[data-automation-id="jumbotron-watch-now-button"]').click();

      cy.url().should('eq', `${Cypress.config().baseUrl}/christmas-special/?autoplay=true&sound=11`);
      cy.get('[data-automation-id="404-search-field"]').as('404SearchField').should('not.exist');
    });

    it('Offstream State: Checks clicking "Watch This Weeks Service" navs to the latest message', function () {
      const fakeFutureSchedule = getStreamSchedule(24);
      cy.route(`${Cypress.env('stream_schedule_env')}/streamSchedule`, fakeFutureSchedule);
      cy.ignoreMatchingErrors([countdownConstructorError]);
      cy.visit('/live');

      cy.get('[data-automation-id="watch-service-button"]').click();

      cy.url().should('eq', `${Cypress.config().baseUrl}/media${this.messageUrl}?autoPlay=true&sound=11`);
    });
  });

  describe.skip('Tests state when stream is running', function () {
    before(function () {
      const fakeCurrentSchedule = getStreamSchedule(0);
      cy.server();
      cy.route(`${Cypress.env('stream_schedule_env')}/streamSchedule`, fakeCurrentSchedule);
      cy.visit('/live');
    });

    it('Checks offstream content is displayed', function () {
      cy.get('[class^="content-live"]').should('not.be.visible');
      cy.get('[class^="content-upcoming"]').should('be.visible');
      cy.get('[class^="content-offstream"]').should('be.visible');
    });

    it('Checks "Watch Now" is displayed and has correct link', function () {
      cy.get('[data-automation-id="watch-service-button"]')
        .should('be.visible')
        .and('have.attr', 'href', `/media${this.messageUrl}?autoPlay=true&sound=11`);
      });
  });

  //Upcoming state is between 0.1 and 16 hours
  //Note that future streaming time can't be accurately spoofed when running on Travis, so don't check exact time
  describe.skip('Tests display when the stream is upcoming', function () {
    before(function () {
      const fakeFutureSchedule = getStreamSchedule(10);
      cy.server();
      cy.route(`${Cypress.env('stream_schedule_env')}/streamSchedule`, fakeFutureSchedule);
      cy.visit('/live');
    });

    it('Checks upcoming content is displayed', function () {
      cy.get('[class^="content-live"]').should('not.be.visible');
      cy.get('[class^="content-upcoming"]').should('be.visible');
      cy.get('[class^="content-offstream"]').should('not.be.visible');
    });

    it('Checks the countdown is displayed with correct days and hours left', function () {
      cy.get('[data-automation-id="jumbotron-countdown"]').as('countdown').should('be.visible');
      cy.get('@countdown').find('[class^="countdown-days"]').text().should('eq', '00');
      cy.get('@countdown').find('[class^="countdown-hours"]').text().should('not.eq', '00');
    });
  });

  //Offstream state is over 16 hours
  //Note that future streaming time can't be accurately spoofed when running on Travis, so don't check exact time
  describe.skip('Tests display when the stream is in the "offstream" state', function () {
    before(function () {
      const fakeFutureSchedule = getStreamSchedule(36);
      cy.server();
      cy.route(`${Cypress.env('stream_schedule_env')}/streamSchedule`, fakeFutureSchedule);
      cy.visit('/live');
    });

    it('Checks offstream content is displayed', function () {
      cy.get('[class^="content-live"]').should('be.visible');
      cy.get('[class^="content-upcoming"]').should('not.be.visible');
      cy.get('[class^="content-offstream"]').should('not.be.visible');
    });

    it('Check "Watch This Weeks Service" is displayed and has correct link', function () {
      cy.get('[data-automation-id="watch-service-button"]')
        .should('not.be.visible')
        .and('have.attr', 'href', `/media${this.messageUrl}?autoPlay=true&sound=11`);
    });
  });
});