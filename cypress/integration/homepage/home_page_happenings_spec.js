import { ContentfulApi } from '../../support/Contentful/ContentfulApi';
import { ElementValidator } from '../../support/ElementValidator';
import { Formatter } from '../../support/Formatter';

describe('Testing the Happenings section on the Homepage without filtering', function() {
    let promoList;
    before(function() {
        const content = new ContentfulApi();
        promoList = content.retrievePromosByAudience();

        cy.visit('/');
    })

    it('Tests "Churchwide" filter is selected by default', function(){
        cy.get('[data-automation-id="happenings-dropdown"]').find('[data-current-label]').should('have.text', 'Churchwide');
    })

    it('Tests "Churchwide" promos are sorted by date then title', function(){
        const audience = "Churchwide"

        cy.get(`[data-automation-id="happenings-cards"] > [data-filter*="${audience}"]`).as('promoCards');
        const sortedPromos = promoList.getPromoListSortedByDateThenTitle(audience);

        expectedNumberOfCardsDisplayed(cy.get('@promoCards'), sortedPromos.length);
        sortedPromos.forEach(($promo,$i) => {
            cardHasExpectedContent(cy.get('@promoCards').eq($i), $promo);
        })
    })

    it('Tests user can filter by any Target Audience on a promo', function(){
        const audienceCount = promoList.audienceList.length;
        assert.isAbove(audienceCount, 0, 'Sanity check: Promos have at least one target audience');

        cy.get('[data-automation-id="happenings-dropdown"]').as('promoFilter')
        .find('[data-filter-select]').then($audienceList => {
            expect($audienceList).lengthOf(audienceCount);
        })

        promoList.audienceList.forEach(a =>{
            cy.get('@promoFilter').find(`[data-filter-select="${a}"]`).should('exist');
        })
    })
})

describe('Testing the filtering functionality for the Homepage Happenings section', function() {
    let promoList;
    before(function() {
        const content = new ContentfulApi();
        promoList = content.retrievePromosByAudience();

        cy.visit('/');
    })

    it('Tests filtering by "Oakley" displays only Oakley promos sorted by date then title', function(){
        const audience = "Oakley"
        selectFilter(audience);

        cy.get(`[data-automation-id="happenings-cards"] > [data-filter*="${audience}"]`).as('promoCards');
        const sortedPromos = promoList.getPromoListSortedByDateThenTitle(audience);

        expectedNumberOfCardsDisplayed(cy.get('@promoCards'), sortedPromos.length);
        sortedPromos.forEach(($promo,$i) => {
            cardHasExpectedContent(cy.get('@promoCards').eq($i), $promo);
        })
    })
})

function expectedNumberOfCardsDisplayed(displayedCards, count){
    displayedCards.then($cardList => {
        expect($cardList).lengthOf(count);
    })
}

function cardHasExpectedContent(displayedCard, promo){
    ElementValidator.elementContainsSubstringOfText(
        displayedCard.find('.card-title'), Formatter.normalizeText(promo.title));
}

function selectFilter(audience){
    cy.get('[data-automation-id="happenings-dropdown"]').as('promoFilter');
    cy.get('@promoFilter').click();
    cy.get('@promoFilter').find(`[data-filter-select="${audience}"]`).click();
}