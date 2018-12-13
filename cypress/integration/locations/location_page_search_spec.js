import { ContentfulApi } from '../../support/Contentful/ContentfulApi';

describe('Testing the Locations page without searching', function() {
    let locations;
    before(function() {
        const content = new ContentfulApi();
        locations = content.retrieveLocations();

         //Wait for response before navigating
         cy.wrap({locations}).its('locations.length').should('be.above', 0).then(() => {
            cy.visit('/locations');
        })
    })

    it('Tests Location cards displayed alphabetically followed by Anywhere', function() {
        const sortedLocations = sortArrayByProperty(locations, 'name');

        cy.get('#section-locations > .card').each(($card, index) => {
            //Locations
            if (index < sortedLocations.length){
                expect($card.find('a')).to.have.attr('href', `/${sortedLocations[index].slug}`);
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

describe('Testing the search functionality on the Locations page', function() {
    let locations;
    before(function() {
        const content = new ContentfulApi();
        locations = content.retrieveLocations();

        //Wait for response before navigating
        cy.wrap({locations}).its('locations.length').should('be.above', 0).then(() => {
            cy.visit('/locations');
        })
    })

    //For a Contentful Location card to display the distance, its address must be valid
    it('Tests Location search displays Oakley card first when searching for Oakley by zip, and card displays distance', function(){
        const oakleyLocation = locations.find(l => l.slug == 'oakley');
        const oakleyZip = '45209';

        searchForLocation(oakleyZip);

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

        searchForLocation(florenceAddress);

        cy.get('#section-locations > .card').first().then(($card) => {
            expect($card.find('a')).to.have.attr('href').contains(florenceLocation.slug);
        })
    })

    it('Tests Location search displays Anywhere card first when searching for out of range location', function(){
        const outOfRangeLocation = 'Peru';

        searchForLocation(outOfRangeLocation);

        cy.get('#section-locations > .card').first().then(($card) => {
            expect($card.find('a')).to.have.attr('href').contains('live');
            expect($card.find('.card-title > a')).to.contain('Anywhere');
        })
    })

    it('Tests Location search error displays after invalid search but not after valid search', function(){
        const invalidSearch = 'iqupwetoup;djnoipw';
        const validSearch = 'Peru';

        searchForLocation(invalidSearch);

        cy.get('[data-automation-id="locations-carousel"] > .error-text').as('searchError').should('be.visible');

        searchForLocation(validSearch);

        cy.get('@searchError').should('not.exist');
    })
})

function sortArrayByProperty(array, property){
    return array.sort(function(a, b) {
        if (a[property] > b[property])
            return 1;
        if (a[property] < b[property])
            return -1;
        return 0;
    });
}

function searchForLocation(keyword){
    cy.server();
    cy.route('/gateway/api/v1.0.0/locations/proximities?origin=*').as('searchQuery');

    cy.get('[data-automation-id="location-search"]').as('search');
    cy.get('@search').find('input').clear().type(keyword);
    cy.get('@search').find('button').click();

    //Wait for search request to return
    cy.wait('@searchQuery');
}