import { ContentfulApi } from '../../support/Contentful/ContentfulApi';
import { ElementValidator } from '../../support/ElementValidator'

describe("Testing the Current Series on the Homepage", function () {
    let currentSeries;
    before(function () {
        const content = new ContentfulApi();
        currentSeries = content.retrieveCurrentSeries();
        cy.visit('/');

    })

    it('Tests current series title, description, and image', function(){
        const seriesLink = `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug}`;

        ElementValidator.elementHasTextAndLink(cy.get('[data-automation-id="series-title"]'), currentSeries.title, seriesLink);
        ElementValidator.elementContainsSubstringOfText(cy.get('[data-automation-id="series-description"]'), currentSeries.description);
        ElementValidator.elementHasImgixImageAndLink(cy.get('[data-automation-id="series-image"]'), currentSeries.imageId, seriesLink);
    })

    it.skip('Tests Watch Latest Service button link', function(){
        const seriesLink = `${Cypress.env('CRDS_MEDIA_ENDPOINT')}/series/${currentSeries.slug}`;

        //Desktop version
        ElementValidator.elementHasTextAndLink(cy.get('[data-automation-id="watch-series-button"]'), 'Watch the latest service', seriesLink)

        //Mobile version
        ElementValidator.hiddenElementHasTextAndLink(cy.get('[data-automation-id="mobile-watch-series-button"]'), 'Watch the latest service', seriesLink)
    })
})
