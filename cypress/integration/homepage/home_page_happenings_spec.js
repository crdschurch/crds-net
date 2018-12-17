import { ContentfulApi } from '../../support/Contentful/ContentfulApi';

describe('Testing the Happenings section on the Homepage without filtering', function() {
    //let promos;
    before(function() {
        //const content = new ContentfulApi();
        //promos = content.retrievePromosByLocation();

        cy.visit('/');
    })

    it('Tests "Churchwide" filter is selected by default', function(){
        cy.get('[data-automation-id="happenings-dropdown"]').find('[data-current-label]').should('have.text', 'Churchwide');
    })

    it('Tests user can filter by any Target Audience', function(){
        //get list of expected target audiences
        //make sure all are listed infilter
    })
})

describe('Testing the filtering functionality for the Homepage Happenings section', function() {
    let promos;
    before(function() {
        const content = new ContentfulApi();
        promos = content.retrievePromosByLocation();

        cy.visit('/');
    })

    it.only('Tests selecting the "Oakley" filter displays only Oakley promos', function(){
        const oakleyPromos = promos["Oakley"];
        cy.log(oakleyPromos.length);//debug
        selectFilter("Oakley");

        //TODO change this to a data-automation-id
        cy.get('#section-what-s-happening > [data-filter*="Churchwide"]').then($cardList => {
            expect($cardList).lengthOf(oakleyPromos.length);
        })
        //see if can do this by element content
    })

    function selectFilter(audience){
        cy.get('[data-automation-id="happenings-dropdown"]').as("filter");
        cy.get('@filter').click();//open
        cy.get('@filter').find(`[data-filter-select="${audience}"]`).click();//TODO selecting is legit throwing a console error that doesn't affect the page.
        // Try raising a defect but catching it here
    }

    it('Tests filtered results are ordered by date (newest to oldest)', function(){
        //may need to sort promos by title too if dates are identical
    })
    //verify expected target audiences can be selected
//sort by oakley - results should only include oakley promos sorted by date


})