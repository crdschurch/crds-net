import { ContentfulApi } from '../../support/Contentful/ContentfulApi';

function sortArrayByProperties(array, prop1, prop2){
    return array.sort(function(a, b) {
        let diff = a[prop1].localeCompare(b[prop1]);
        if(diff === 0)
            diff = a[prop2].localeCompare(b[prop2]);
        return diff;
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

describe('Testing the Locations page without searching:', function() {
    let locations;
    before(function() {
        const content = new ContentfulApi();
        locations = content.retrieveLocations();

        cy.wrap({locations}).its('locations.length').should('be.above', 0).then(() => {
        });

        cy.visit('/locations');
    });

    it('Location cards should display alphabetically followed by Anywhere', function() {
        const sortedLocations = sortArrayByProperties(locations, 'name', 'slug');

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
        });
    });

    it('Distance should not be displayed on Location cards', function(){
        cy.get('#section-locations > .card').first().then(($card) => {
            expect($card).to.not.have.attr('data-distance');
            expect($card.find('.distance')).to.not.exist;
        });
    });
});

describe('Testing the search functionality on the Locations page:', function() {
    let locations;
    before(function() {
        const content = new ContentfulApi();
        locations = content.retrieveLocations();

        cy.wrap({locations}).its('locations.length').should('be.above', 0).then(() => {
        });

        cy.visit('/locations');
    });

    //For a Contentful Location card to display the distance, its address must be valid
    it('Searching for Oakley by zip should display the Oakley card first, with its distance', function(){
        const oakleyLocation = locations.find(l => l.slug == 'oakley');
        const oakleyZip = '45209';

        searchForLocation(oakleyZip);

        cy.get('#section-locations > .card').first().then(($card) => {
            expect($card).to.be.visible;
            expect($card.find('a')).to.have.attr('href').contains(oakleyLocation.slug);

            //Distance overlay displayed
            expect($card).to.have.attr('data-distance').and.be.gte(0);
            expect($card.find('.distance')).to.contain('miles');
        });
    });

    it('Searching for Florence by address should display the Florence card first', function(){
        const florenceLocation = locations.find(l => l.slug == 'florence');
        const florenceAddress = '828 Heights Blvd Florence KY';

        searchForLocation(florenceAddress);

        cy.get('#section-locations > .card').first().then(($card) => {
            expect($card.find('a')).to.have.attr('href').contains(florenceLocation.slug);
        });
    });

    it('Searching for an out of range location should display the Anywhere card first', function(){
        const outOfRangeLocation = 'Peru';

        searchForLocation(outOfRangeLocation);

        cy.get('#section-locations > .card').first().then(($card) => {
            expect($card.find('a')).to.have.attr('href').contains('live');
            expect($card.find('.card-title > a')).to.contain('Anywhere');
        });
    });

    it('An error should display after searching for nonsense text, then should disappear after a valid search', function(){
        const invalidSearch = 'iqupwetoup;djnoipw';
        const validSearch = 'Peru';

        searchForLocation(invalidSearch);

        cy.get('[data-automation-id="locations-carousel"] > .error-text').as('searchError').should('be.visible');

        searchForLocation(validSearch);

        cy.get('@searchError').should('not.exist');
    });
});