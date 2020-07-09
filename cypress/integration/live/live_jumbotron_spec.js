import { StreamScheduleGenerator } from '../../support/StreamScheduleGenerator';
import { MessageQueryBuilder } from 'crds-cypress-contentful';
import { getRelativeMessageUrl } from '../../support/GetUrl';

function visitLivePageWithSchedule(fakeSchedule) {
  cy.server();
  cy.route(`${Cypress.env('schedule_env')}/streamSchedule`, fakeSchedule);

  cy.visit('/live');
}

describe('Tests the /live jumbotron content with different stream times:', function() {
  let scheduleGenerator;

  before(function() {
    scheduleGenerator = new StreamScheduleGenerator();

    // Get current message
    const qb = new MessageQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.slug';
    qb.limit = 1;
    cy.task('getCNFLResource', qb.queryParams)
      .then(getRelativeMessageUrl)
      .as('messageUrl');
  });

  describe('Tests button navigation:', function() {
    it('Live Stream State: Checks clicking "Watch Now" navs to the live stream', function() {
      const fakeCurrentSchedule = scheduleGenerator.getStreamStartingAfterHours(0);
      visitLivePageWithSchedule(fakeCurrentSchedule);

      //Spoof schedule route again before navigating
      cy.server();
      cy.route(`${Cypress.env('schedule_env')}/streamSchedule`, fakeCurrentSchedule);

      cy.get('[data-automation-id="jumbotron-watch-now-button"]').click();

      cy.url().should('eq', `${Cypress.config().baseUrl}/live/stream/?autoplay=true&sound=11`);
      cy.get('[data-automation-id="404-search-field"]').as('404SearchField').should('not.exist');
    });

    it('Offstream State: Checks clicking "Watch This Weeks Service" navs to the latest message', function() {
      visitLivePageWithSchedule(scheduleGenerator.getStreamStartingAfterHours(24));
      cy.get('[data-automation-id="watch-service-button"]').click();

      cy.url().should('eq', `${Cypress.config().baseUrl}/media${this.messageUrl}?autoPlay=true&sound=11`);
    });
  });

  describe('Tests state when stream is running', function() {
    before(function() {
      visitLivePageWithSchedule(scheduleGenerator.getStreamStartingAfterHours(0));
    });

    it('Checks live content is displayed', function() {
      cy.get('[class^="content-live"]').should('be.visible');
      cy.get('[class^="content-upcoming"]').should('not.be.visible');
      cy.get('[class^="content-offstream"]').should('not.be.visible');
    });

    it('Checks "Watch Now" is displayed and has correct link', function() {
      cy.get('[data-automation-id="jumbotron-watch-now-button"]')
        .should('be.visible')
        .and('have.attr', 'href', '/live/stream?autoplay=true&sound=11');
    });
  });

  //Upcoming state is between 0.1 and 16 hours
  //Note that future streaming time can't be accurately spoofed when running on Travis, so don't check exact time
  describe('Tests display when the stream is upcoming', function() {
    before(function() {
      visitLivePageWithSchedule(scheduleGenerator.getStreamStartingAfterHours(10));
    });

    it('Checks upcoming content is displayed', function() {
      cy.get('[class^="content-live"]').should('not.be.visible');
      cy.get('[class^="content-upcoming"]').should('be.visible');
      cy.get('[class^="content-offstream"]').should('not.be.visible');
    });

    it('Checks the countdown is displayed with correct days and hours left', function() {
      cy.get('[data-automation-id="jumbotron-countdown"]').as('countdown').should('be.visible');
      cy.get('@countdown').find('[class^="countdown-days"]').text().should('eq', '00');
      cy.get('@countdown').find('[class^="countdown-hours"]').text().should('not.eq', '00');
    });
  });

  //Offstream state is over 16 hours
  //Note that future streaming time can't be accurately spoofed when running on Travis, so don't check exact time
  describe('Tests display when the stream is in the "offstream" state', function() {
    before(function() {
      visitLivePageWithSchedule(scheduleGenerator.getStreamStartingAfterHours(36));
    });

    it('Checks offstream content is displayed', function() {
      cy.get('[class^="content-live"]').should('not.be.visible');
      cy.get('[class^="content-upcoming"]').should('not.be.visible');
      cy.get('[class^="content-offstream"]').should('be.visible');
    });

    it('Check "Watch This Weeks Service" is displayed and has correct link', function() {
      cy.get('[data-automation-id="watch-service-button"]')
        .should('be.visible')
        .and('have.attr', 'href', `${this.messageUrl}?autoPlay=true&sound=11`);
    });
  });
});
