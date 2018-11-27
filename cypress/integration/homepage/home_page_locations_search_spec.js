import { ContentfulApi } from '../../support/Contentful/ContentfulApi';

describe('Testing the Locations section on the Homepage without searching', function() {
    let locations;
    before(function() {
        const content = new ContentfulApi();
        locations = content.retrieveLocations();
        cy.visit('/');
    })

    it('Tests Location cards displayed alphabetically followed by Anywhere', function() {
        const locationSlugs = locations.map(l => l.slug).sort();

        cy.get('#section-locations > .card').each(($card, index) => {
            //Locations
            if (index < locationSlugs.length){
                expect($card.find('a')).to.have.attr('href').contains(locationSlugs[index]);
            }
            //Anywhere
            else {
                expect($card.find('a')).to.have.attr('href').contains('live');
                return false; //Skip Prison Ministry cards after Anywhere - these are hard-coded
            }
        })
    })

    it('Tests distance is not displayed on Location cards', function(){
        cy.get('#section-locations > .card').first().then(($card) => {
            expect($card).to.not.have.attr('data-distance');
            expect($card.find('.distance')).to.not.exist;
        })
    })
})

describe('Testing the search functionality of the Locations section on the Homepage', function() {
    let locations;
    before(function() {
        const content = new ContentfulApi();
        locations = content.retrieveLocations();
        cy.visit('/');
    })

    //For a Contentful Location card to display the distance, its address must be valid
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

    it('Tests Location search displays Florence card first when searching for Florence by address', function(){
        const florenceLocation = locations.find(l => l.slug == 'florence');
        const florenceAddress = '828 Heights Blvd Florence KY';

        searchForThis(florenceAddress);

        cy.get('#section-locations > .card').first().then(($card) => {
            expect($card.find('a')).to.have.attr('href').contains(florenceLocation.slug);
        })
    })

    it('Tests Location search displays Anywhere card first when searching for out of range location', function(){
        const outOfRangeLocation = 'Peru';

        searchForThis(outOfRangeLocation);

        cy.get('#section-locations > .card').first().then(($card) => {
            expect($card.find('a')).to.have.attr('href').contains('live');
            expect($card.find('.card-title > a')).to.contain('Anywhere');
        })
    })


    it('Tests Location search error displays after invalid search but not after valid search', function(){
        const invalidSearch = 'iqupwetoup;djnoipw';
        const validSearch = 'Peru';

        searchForThis(invalidSearch);

        cy.get('.locations > .error-text').as('searchError').should('be.visible');

        searchForThis(validSearch);

        cy.get('@searchError').should('not.exist');
    })

    function searchForThis(keyword){
        cy.server();
        cy.route('/gateway/api/v1.0.0/locations/proximities?origin=*').as('searchQuery');

        cy.get('#locations-address-input').as('search');
        cy.get('@search').find('input').clear().type(keyword);
        cy.get('@search').find('button').click();

        //Wait for search request to return
        cy.wait('@searchQuery');
    }
})
