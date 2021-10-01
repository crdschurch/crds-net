import { MessageQueryBuilder } from 'crds-cypress-contentful';
import { getRelativeMessageUrl } from '../../support/GetUrl';
const errorsToIgnore = [/.*Script error.*/, /.*uncaught exception*/, /.*Cannot read property 'replace' of undefined*/, /.*> Cannot read property 'addEventListener' of null*/,  /.* > Cannot read property 'getAttribute' of null*/, /.* > Cannot set property 'status' of undefined*/];

describe('Tests download links on message page', function () {
  describe('Tests Bitmovin messages with audio file', () => {
    let bitmovinMessage;

    before(function () {
      const qb = new MessageQueryBuilder();
      qb.orderBy = '-fields.published_at';
      qb.select = 'fields.title,fields.slug,fields.video_file,fields.audio_file';
      qb.searchFor = 'fields.bitmovin_url[exists]=true&fields.audio_file[exists]=true';
      cy.task('getCNFLResource', qb.queryParams)
        .then((message) => {
          bitmovinMessage = message;

          getRelativeMessageUrl(bitmovinMessage)
            .then((url) => {
              cy.ignoreMatchingErrors(errorsToIgnore);
              cy.visit(`${Cypress.config().baseUrl}${url}`);
            });
        });

      cy.server();
    });

    it('Checks HD video link and download file has friendly name', () => {
      const downloadLink = `https://d1gb5n5uoite2y.cloudfront.net/bitmovin/${bitmovinMessage.video_file.sys_id}/${bitmovinMessage.video_file.sys_id}_1080p.mp4`;
      cy.get('[data-automation-id="download-video-link-HD"]').as('downloadHDVideo')
        .should('be.visible')
        .should('have.prop', 'href', downloadLink);

      // File should exist in storage
      cy.request('HEAD', `https://${Cypress.env('BITMOVIN_BUCKET')}.s3.amazonaws.com/${Cypress.env('BITMOVIN_DIRECTORY')}/${bitmovinMessage.video_file.sys_id}/${bitmovinMessage.video_file.sys_id}_1080p.mp4`)
        .its('status').should('eq', 200);
    });

    it('Checks SD video link and download file has friendly name', () => {
      const downloadLink = `https://d1gb5n5uoite2y.cloudfront.net/bitmovin/${bitmovinMessage.video_file.sys_id}/${bitmovinMessage.video_file.sys_id}_360p.mp4`;
      cy.get('[data-automation-id="download-video-link-SD"]').as('downloadSDVideo')
        .should('be.visible')
        .should('have.prop', 'href', downloadLink);

      // File should exist in storage
      cy.request('HEAD', `https://${Cypress.env('BITMOVIN_BUCKET')}.s3.amazonaws.com/${Cypress.env('BITMOVIN_DIRECTORY')}/${bitmovinMessage.video_file.sys_id}/${bitmovinMessage.video_file.sys_id}_360p.mp4`)
        .its('status').should('eq', 200);
    });

    it('Checks audio link and download file exist', () => {
      assert.isTrue(bitmovinMessage.audio_file.isPublished, 'Audio file asset must be published');

      cy.get('[data-automation-id="download-audio-link"]').as('downloadAudio')
        .should('be.visible')
        .should('have.prop', 'href', `https:${bitmovinMessage.audio_file.file.url}`);
    });
  });
});