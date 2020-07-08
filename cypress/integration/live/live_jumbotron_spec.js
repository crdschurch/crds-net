import { StreamScheduleGenerator } from '../../support/StreamScheduleGenerator';
import { RouteValidator } from '../../support/RouteValidator';
import { MessageQueryManager } from 'crds-cypress-contentful';

function visitLivePageWithSchedule(fakeSchedule) {
  cy.server();
  cy.route(`${Cypress.env('schedule_env')}/streamSchedule`, fakeSchedule);

  cy.visit('/live');
}

describe('Tests the /live jumbotron content with different stream times:', () => {
  let scheduleGenerator;
  let currentMessage;
  let autoplayURL;
  before(() => {
    scheduleGenerator = new StreamScheduleGenerator();

    const mqm = new MessageQueryManager();
    mqm.getSingleEntry(mqm.query.latestMessage).then(message => {
      currentMessage = message;
      currentMessage.getURL().then(url => {
        autoplayURL = url.autoplay;
      });
    });
  });

  describe('Tests button navigation:', () => {
    it('Live Stream State: Checks clicking "Watch Now" navs to the live stream', () => {
      const fakeCurrentSchedule = scheduleGenerator.getStreamStartingAfterHours(0);
      visitLivePageWithSchedule(fakeCurrentSchedule);

      //Spoof schedule route again before navigating
      cy.server();
      cy.route(`${Cypress.env('schedule_env')}/streamSchedule`, fakeCurrentSchedule);

      cy.get('[data-automation-id="jumbotron-watch-now-button"]').click();
      RouteValidator.pageFoundAndURLMatches(`${Cypress.config().baseUrl}/live/stream/?autoplay=true&sound=11`);
    });

    it('Offstream State: Checks clicking "Watch This Weeks Service" navs to the latest message', () => {
      visitLivePageWithSchedule(scheduleGenerator.getStreamStartingAfterHours(24));
      cy.get('[data-automation-id="watch-service-button"]').click();
      RouteValidator.pageFoundAndURLMatches(autoplayURL.absolute);
    });
  });

  describe('Tests state when stream is running', () => {
    before(() => {
      visitLivePageWithSchedule(scheduleGenerator.getStreamStartingAfterHours(0));
    });

    it('Checks live content is displayed', () => {
      cy.get('[class^="content-live"]').should('be.visible');
      cy.get('[class^="content-upcoming"]').should('not.be.visible');
      cy.get('[class^="content-offstream"]').should('not.be.visible');
    });

    it('Checks "Watch Now" is displayed and has correct link', () => {
      cy.get('[data-automation-id="jumbotron-watch-now-button"]')
        .should('be.visible')
        .and('have.attr', 'href', '/live/stream?autoplay=true&sound=11');
    });
  });

  //Upcoming state is between 0.1 and 16 hours
  //Note that future streaming time can't be accurately spoofed when running on Travis, so don't check exact time
  describe('Tests display when the stream is upcoming', () => {
    before(() => {
      visitLivePageWithSchedule(scheduleGenerator.getStreamStartingAfterHours(10));
    });

    it('Checks upcoming content is displayed', () => {
      cy.get('[class^="content-live"]').should('not.be.visible');
      cy.get('[class^="content-upcoming"]').should('be.visible');
      cy.get('[class^="content-offstream"]').should('not.be.visible');
    });

    it('Checks the countdown is displayed with correct days and hours left', () => {
      cy.get('[data-automation-id="jumbotron-countdown"]').as('countdown').should('be.visible');
      cy.get('@countdown').find('[class^="countdown-days"]').text().should('eq', '00');
      cy.get('@countdown').find('[class^="countdown-hours"]').text().should('not.eq', '00');
    });
  });

  //Offstream state is over 16 hours
  //Note that future streaming time can't be accurately spoofed when running on Travis, so don't check exact time
  describe('Tests display when the stream is in the "offstream" state', () => {
    before(() => {
      visitLivePageWithSchedule(scheduleGenerator.getStreamStartingAfterHours(36));
    });

    it('Checks offstream content is displayed', () => {
      cy.get('[class^="content-live"]').should('not.be.visible');
      cy.get('[class^="content-upcoming"]').should('not.be.visible');
      cy.get('[class^="content-offstream"]').should('be.visible');
    });

    it('Check "Watch This Weeks Service" is displayed and has correct link', () => {
      cy.get('[data-automation-id="watch-service-button"]')
        .should('be.visible')
        .and('have.attr', 'href', autoplayURL.relative);
    });
  });
});
