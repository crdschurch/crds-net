import { RouteValidator } from '../../support/RouteValidator';

describe('Testing crds-net pages are not from Maestro:', function () {
  it('crossroads.net should not be rendered by Maestro', function () {
    cy.request('GET', '/')
      .then((response) => {
        RouteValidator.responseShouldNotBeFromMaestro(response);
        RouteValidator.responseShouldBeFromNetlify(response);
      });
  });

  it('/live should not be rendered by Maestro', function () {
    cy.request('GET', 'live/')
      .then((response) => {
        RouteValidator.responseShouldNotBeFromMaestro(response);
        RouteValidator.responseShouldBeFromNetlify(response);
      });
  });

  it('/live/stream should not be rendered by Maestro', function () {
    cy.request('GET', '/live/stream/')
      .then((response) => {
        RouteValidator.responseShouldNotBeFromMaestro(response);
        RouteValidator.responseShouldBeFromNetlify(response);
      });
  });

  it('/404 should not be rendered by Maestro', function () {
    cy.request('GET', '404/')
      .then((response) => {
        RouteValidator.responseShouldNotBeFromMaestro(response);
        RouteValidator.responseShouldBeFromNetlify(response);
      });
  });

  it('/family-meeting-stream should not be rendered by Maestro', function () {
    cy.request('GET', 'family-meeting-stream/')
      .then((response) => {
        RouteValidator.responseShouldNotBeFromMaestro(response);
        RouteValidator.responseShouldBeFromNetlify(response);
      });
  });

  it('/locations should not be rendered by Maestro', function () {
    cy.request('GET', 'locations/')
      .then((response) => {
        RouteValidator.responseShouldNotBeFromMaestro(response);
        RouteValidator.responseShouldBeFromNetlify(response);
      });
  });

  it('/updates should not be rendered by Maestro', function () {
    cy.request('GET', 'updates/')
      .then((response) => {
        RouteValidator.responseShouldNotBeFromMaestro(response);
        RouteValidator.responseShouldBeFromNetlify(response);
      });
  });
});

describe('Testing crds-net-shared pages are not rendered by Maestro:', function () {
  it('/atriumevents should not be rendered by Maestro', function () {
    cy.request('GET', 'atriumevents/')
      .then((response) => {
        RouteValidator.responseShouldNotBeFromMaestro(response);
        RouteValidator.responseShouldBeFromNetlify(response);
      });
  });

  it('/womancamp should not be rendered by Maestro', function () {
    cy.request('GET', 'womancamp/')
      .then((response) => {
        RouteValidator.responseShouldNotBeFromMaestro(response);
        RouteValidator.responseShouldBeFromNetlify(response);
      });
  });

  it('/undivided should not be rendered by Maestro', function () {
    cy.request('GET', 'undivided/')
      .then((response) => {
        RouteValidator.responseShouldNotBeFromMaestro(response);
        RouteValidator.responseShouldBeFromNetlify(response);
      });
  });

  it('/obsessed should not be rendered by Maestro', function () {
    cy.request('GET', 'obsessed/')
      .then((response) => {
        RouteValidator.responseShouldNotBeFromMaestro(response);
        RouteValidator.responseShouldBeFromNetlify(response);
      });
  });
});