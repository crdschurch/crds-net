import { MessageQueryBuilder } from 'crds-cypress-contentful';
import { getRelativeMessageUrl } from '../../support/GetUrl';
const errorsToIgnore = [/.* > a.push is not a function*/, /.*Script error.*/, /.*uncaught exception*/, /.*Cannot read property 'replace' of undefined*/, /.*> Cannot read property 'addEventListener' of null*/, /.* > Cannot read property 'getAttribute' of null*/, /.* > Cannot set property 'status' of undefined*/, /.* > Cannot read property 'attributes' of undefined*/, /.* > a.push is not a function */];

function getYoutubeId(youtubeURL) {
  const regex = /youtu(?:be|.be)?(?:.+)\/(?:.+v=)?(.{11})/;
  const match = regex.exec(youtubeURL)[1];
  expect(match).to.exist;
  return match;
}

describe('Tests a message page with a BitMovin URL', function () {  //Skip until autoplay has been added back into functionalitylo 
  let bitmovinMessage;
  let messageUrl;
  before(function () {
    const qb = new MessageQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.slug,fields.bitmovin_url';
    qb.searchFor = 'fields.bitmovin_url[exists]=true';
    cy.task('getCNFLResource', qb.queryParams)
      .then((message) => {

        bitmovinMessage = message;
        return message;
      })
      .then(getRelativeMessageUrl)
      .then((url) => {
        messageUrl = `${Cypress.config().baseUrl}${url}`;
        cy.log(`${Cypress.config().baseUrl}`)
        cy.log(`${url}`)
        cy.log(messageUrl)
      });
  });

  it.skip('The Bitmovin video should autoplay', function () {
    cy.ignoreMatchingErrors(errorsToIgnore);
    cy.visit('https://int.crossroads.net/media/series/');
    cy.get('a').contains('View the series').click();
    cy.get('.card').first().click();
    cy.get('crds-bitmovin-player').as('bitmovinPlayer').should('be.visible');
    cy.wait(3000);
    cy.location().its('href').should('include', 'autoplay=true&sound=11')

    cy.url().should('include', 'autoplay=true&sound=11')
    const url = cy.get(url);
    //  const arr = url.split('?');
    //   cy.log(arr);
    // cy.get('a').contains(`${url}`).click();
    // cy.server();
    //  cy.route('manifest.m3u8').as('bitmovinManifest');
    //   cy.visit(messageUrl);
    cy.url().should('include', 'autoplay=true&sound=11');
  });

  it('BitMovin player should be displayed', function () {
    cy.ignoreMatchingErrors(errorsToIgnore);
    cy.visit(messageUrl);
    cy.get('crds-bitmovin-player').as('bitmovinPlayer').should('be.visible');
    cy.get('crds-youtube-player').as('youtubePlayer').should('not.exist');
  });
});

describe('Tests a message page with only a Youtube URL', function () {
  it('Youtube player should be displayed with expected video', function () {
    const qb = new MessageQueryBuilder();
    qb.orderBy = '-fields.published_at';
    qb.select = 'fields.slug,fields.source_url';
    qb.searchFor = 'fields.bitmovin_url[exists]=false&fields.source_url[exists]=true';
    cy.task('getCNFLResource', qb.queryParams)
      .then((youtubeMessage) => {
        const youtubeId = getYoutubeId(youtubeMessage.source_url.text);
        getRelativeMessageUrl(youtubeMessage)
          .then((url) => {
            cy.ignoreMatchingErrors(errorsToIgnore);
            cy.visit(`${Cypress.config().baseUrl}${url}`);

            cy.get('crds-bitmovin-player').as('bitmovinPlayer')
              .should('not.exist');

            cy.get('crds-youtube-player').as('youtubePlayer')
              .should('be.visible')
              .should('have.attr', 'video-id', youtubeId);
          });
      });
  });
});