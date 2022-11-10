import { ContentfulQueryBuilder } from 'crds-cypress-contentful';
const errorsToIgnore = [/.* > Cannot read property 'attributes' of undefined*/, /.* > a.push is not a function*/, /.*Script error.*/, /.*uncaught exception*/, /.*Cannot read property 'replace' of undefined*/, /.*> Cannot read property 'addEventListener' of null*/, /.* > Cannot read property 'getAttribute' of null*/, /.* > Cannot set property 'status' of undefined*/];

describe('Tests Video page with Bitmovin video', () => {
  let bitmovinVideo;

  before(() => {
    const qb = new ContentfulQueryBuilder('video');
    qb.select = 'fields.slug';
    qb.searchFor = 'fields.bitmovin_url[exists]=true';
    cy.task('getCNFLResource', qb.queryParams)
      .then(video => {
        bitmovinVideo = video;
      });
  });

  it('Checks video uses Bitmovin player', () => {
    cy.ignoreMatchingErrors(errorsToIgnore);
    cy.visit(`media/videos/${bitmovinVideo.slug.text}`);

    cy.get('div[data-video-player]').as('videoPlayer')
      .should('have.prop', 'class')
      .and('contain', 'bitmovinplayer');
  });

  it.skip('Checks video autoplays if url has autoplay=true query params', () => {
    cy.visit(`media/videos/${bitmovinVideo.slug.text}?autoPlay=true&sound=11`);

    // Confirm autoplay has started by listening for the event
    cy.get('@analytics.track')
      .should('have.been.calledWith', 'VideoStarted');
  });
});

describe.skip('Tests Video page with Youtube video', () => {
  it('Checks video uses Youtube player', () => {
    const qb = new ContentfulQueryBuilder('video');
    qb.select = 'fields.slug';
    qb.searchFor = 'fields.bitmovin_url[exists]=false';
    cy.task('getCNFLResource', qb.queryParams)
      .then((youtubeVideo) => {
        cy.log(qb);
        cy.ignoreMatchingErrors(errorsToIgnore);
        cy.visit(`media/videos/${youtubeVideo.slug.text}`);

        cy.get('crds-youtube-player').as('videoPlayer')
          .should('have.prop', 'class')
          .and('contain', 'embed-responsive');
      });
  });
});