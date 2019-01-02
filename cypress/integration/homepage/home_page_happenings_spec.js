import { ContentfulApi } from '../../support/Contentful/ContentfulApi';
import { ElementValidator } from '../../support/ElementValidator'

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
    let promos;
    before(function() {
        const content = new ContentfulApi();
        promos = content.retrievePromosByAudience();

        cy.visit('/');
    })

    it('Tests selecting the "Oakley" filter displays Oakley promos sorted by date then title', function(){
        const audience = "Oakley"
        selectFilter(audience);

        const sortedPromos = promos.getPromoListSortedByDateThenTitle(audience);
        cy.get(`[data-automation-id="happenings-cards"] > [data-filter*="${audience}"]`).as('promoCards').then($cardList => {
            expect($cardList).lengthOf(sortedPromos.length);
        })

        sortedPromos.forEach(($promo,$i) => {
            ElementValidator.elementContainsSubstringOfText(
                cy.get('@promoCards').eq($i).find('.card-title'), $promo.title);
        })
    })
})

function selectFilter(audience){
    cy.get('[data-automation-id="happenings-dropdown"]').as('promoFilter');
    cy.get('@promoFilter').click();
    cy.get('@promoFilter').find(`[data-filter-select="${audience}"]`).click();
}