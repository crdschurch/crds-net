/*
nav to homepage
> not order independent > verify locations listed in abc order by default (check against contentful content) <- only care about the card name/id, not what or how it's displayed
what other locations are listed? (anywhere, correcitonals)
*/

import { ContentfulApi } from '../../support/Contentful/ContentfulApi';

// describe('Testing the Locations section on the Homepage without searching', function() {
//     let locations;
//     before(function() {
//         const content = new ContentfulApi();
//         locations = content.retrieveLocations();
//         cy.visit('/');
//     })

//     //Ignore Prison ministry cards since they are hard coded
//     it('Tests Location cards displayed alphabetically followed by Anywhere', function() {
//         const locationSlugs = locations.map(l => l.slug).sort();

//         cy.get('#section-locations > .card').each(($card, index) => {
//             //Locations
//             if (index < locationSlugs.length){
//                 expect($card.find('a')).to.have.attr('href').contains(locationSlugs[index]);
//             }
//             //Anywhere
//             else {
//                 expect($card.find('a')).to.have.attr('href').contains('live');
//                 return false; //Skip cards after Anywhere - these are hard-coded
//             }
//         })
//     })
// })


// search for zip of the non-first location and make sure it displays first. Confirm the distance is displayed (don't care number)
// How to see that other locations are ordered? Maybe check that other locations in list have distance.
// search for address of another location and make sure it displays first. Confirm distance
// search for something invalid - confirm invalid search banner displays
describe('Testing the search functionality of the Locations section on the Homepage', function() {
    let locations;
    before(function() {
        const content = new ContentfulApi();
        locations = content.retrieveLocations();
        cy.visit('/');
    })

    //location
    it('Tests Location search - search for Oakley by zip', function(){
        searchForThis('123');

    })

    it('Tests Location search by address', function(){

    })

    it('Tests distance displayed on expected Location cards after valid search', function(){
        //Confirm each until Anywhere
    })

    it('Tests Location search error after invalid searche', function(){

    })

    function searchForThis(keyword){
        cy.get('#locations-address-input').as('search');
        cy.get('@search').find('input').type(keyword);
        cy.get('@search').find('button').click();
    }
})
