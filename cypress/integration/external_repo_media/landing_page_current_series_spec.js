import {ContentfulApi} from '../../support/Contentful/ContentfulApi';
import { ContentfulElementValidator as Element } from '../../support/Cypress/ContentfulElementValidator';


describe('Testing the Current Series on the Media landing page', function(){
    let currentSeries;
    before(function() {
        const content = new ContentfulApi();
        const seriesList = content.retrieveSeriesManager();

        cy.wrap({seriesList}).its('seriesList.currentSeries').should('not.be.undefined').then(() => {
            currentSeries = seriesList.currentSeries;
            cy.visit(`${Cypress.env('CRDS_MEDIA_ENDPOINT')}/`);
        });
    });

    //Note: this test is here for convenience but should really live with it's code in crds-media
    it('Tests current series title, title link, and description', function(){
        cy.contains('series').parent().find('.featured > .media-body').as('seriesContent');

        cy.get('@seriesContent').find('.component-header > a').as('seriesTitle');
        cy.get('@seriesTitle').should('be.visible').and('contain', currentSeries.title.text);
        cy.get('@seriesTitle').should('have.attr', 'href', `/series/${currentSeries.slug.text}`);

        Element.shouldMatchSubsetOfText(cy.get('@seriesContent').find('div'), currentSeries.description);
    });

    it('Tests current series image and image link', function(){
        cy.contains('series').parent().find('.featured > a').as('seriesImage');

        cy.get('@seriesImage').should('be.visible').and('have.attr', 'href', `/series/${currentSeries.slug.text}`);
        Element.shouldHaveImgixImage(cy.get('@seriesImage').find('img'), currentSeries.image);
    });
});
