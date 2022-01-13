import { MessageQueryBuilder } from 'crds-cypress-contentful';
import { getRelativeMessageUrl } from '../../support/GetUrl';
const errorsToIgnore = [/.* > a.push is not a function*/,/.*Script error.*/, /.*uncaught exception*/, /.*Cannot read property 'replace' of undefined*/, /.*> Cannot read property 'addEventListener' of null*/,  /.* > Cannot read property 'getAttribute' of null*/, /.* > Cannot set property 'status' of undefined*/];

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
      });
  });

  it.skip('The Bitmovin video should autoplay', function () {
    cy.server();
    cy.route('manifest.m3u8').as('bitmovinManifest');

    cy.visit(messageUrl);

    cy.wait('@bitmovinManifest').then(manifest => {
      expect(manifest.url).to.eq(bitmovinMessage.bitmovin_url.text);
    });
  });

  it('BitMovin player should be displayed', function () {
    cy.ignoreMatchingErrors(errorsToIgnore);
    cy.visit(messageUrl);
    cy.get('#VideoManager').as('bitmovinPlayer').should('be.visible');
    cy.get('#js-media-video').as('youtubePlayer').should('not.exist');
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

            cy.get('#VideoManager').as('bitmovinPlayer')
              .should('not.exist');

            cy.get('#js-media-video').as('youtubePlayer')
              .should('be.visible')
              .should('have.attr', 'video-id', youtubeId);
          });
      });
  });
});