import { ContentfulApi } from '../../support/Contentful/ContentfulApi';

/*
* The same code to display the locations seciton is used on both the Homepage and the Locations page.
* Functionality is tested thoroughly on Homepage.
*/
describe('Smoke Testing the search functionality on /locations', function() {
    let locations;
    before(function() {
        const content = new ContentfulApi();
        locations = content.retrieveLocations();
        cy.visit('/locations');
    })

    //For a Contentful Location card to display the distance, it's address must be valid
    it('Tests Location search displays Oakley card first when searching for Oakley by zip, and card displays distance', function(){
        const oakleyLocation = locations.find(l => l.slug == 'oakley');
        const oakleyZip = '45209';

        searchForThis(oakleyZip);

        cy.get('#section-locations > .card').first().then(($card) => {
            expect($card).to.be.visible;
            expect($card.find('a')).to.have.attr('href').contains(oakleyLocation.slug);

            //Distance overlay displayed
            expect($card).to.have.attr('data-distance').and.be.gte(0);
            expect($card.find('.distance')).to.contain('miles');
        })
    })

    it('Tests Location search error displays after invalid search but not after valid search', function(){
        const invalidSearch = 'iqupwetoup;djnoipw';
        const validSearch = 'Peru';

        searchForThis(invalidSearch);

        cy.get('[data-automation-id="locations-carousel"] > .error-text').as('searchError').should('be.visible');

        searchForThis(validSearch);

        cy.get('@searchError').should('not.exist');
    })

    function searchForThis(keyword){
        cy.server();
        cy.route('/gateway/api/v1.0.0/locations/proximities?origin=*').as('searchQuery');

        cy.get('[data-automation-id="location-search"]').as('search');
        cy.get('@search').find('input').clear().type(keyword);
        cy.get('@search').find('button').click();

        //Wait for search request to return
        cy.wait('@searchQuery');
    }
})
