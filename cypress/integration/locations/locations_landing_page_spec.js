import { ContentfulQueryBuilder, normalizeText } from 'crds-cypress-contentful';


const errorsToIgnore = [/.*> Script error.*/,/.*> a.push is not a function*/, /.* > Cannot read property 'getAttribute' of null*/, /.* > errorList.find is not a function*/, /.* > Cannot set property 'status' of undefined*/, /.*TypeError: Cannot read property 'getAttribute' of null*/];


describe('Given I navigate to /locations and do not search:', function() {
  let locationList; 

  before(function() {
    // Get Locations
    const qb = new ContentfulQueryBuilder('location');
    qb.orderBy = 'fields.name,fields.slug';
    qb.select = 'fields.name,fields.slug,fields.image,fields.address,fields.service_times,fields.map_url';
    qb.limit = 1000;
    cy.task('getCNFLResource', qb.queryParams)
      .then((locations) => {
        locationList = locations;
      });
    cy.ignoreMatchingErrors(errorsToIgnore); 
    cy.visit('/locations');
  });

  it('Location card for Anywhere should be displayed after standard location cards', function() {
    cy.get('#section-locations .card').as('locationCards');
    const anywhereIndex = 0;
    cy.get('@locationCards').eq(anywhereIndex)
      .find('[data-automation-id="location-name"]')
      .should('have.attr', 'href', '/anywhere');
  });

  [2, 3, 4].forEach((index) => {
    let location;
    let name;
    before(function() {
      location = locationList[index];
      name = location.name.text;
    });

    it(`Location card #${index} should have a Name`, function() {
      cy.get('#section-locations .card').eq(index).as(`${name}Card`)
        .within(() => {
          cy.get('[data-automation-id="location-name"]').as(`${name}Title`)
            .should('have.text', name);
          cy.get(`@${name}Title`)
            .should('have.attr', 'href')
            .and('contain', location.slug.text);
        });
    });

    it(`Location card #${index} should have an Image`, function() {
      cy.get('#section-locations .card').eq(index).as(`${name}CardImage`)
        .scrollIntoView()
        .within(() => {
          cy.get('[data-automation-id="location-image"]' , {timeout: 60000}).within(() => {
            cy.imgixShouldRunOnElement('img', location.image);
          });          
        });
    });

    it(`Location card #${index} should have an Address and a link to Map`, function() {
      cy.get('#section-locations .card').eq(index).as(`${name}Card`)
        .within(() => {
          cy.get('[data-automation-id="location-address"]').as(`${name}Address`)
            .normalizedText().should('contain', normalizeText(location.address.text));
          cy.get('[data-automation-id="location-map-url"]').as(`${name}MapLink`)
            .should('have.attr', 'href', location.map_url.text);
        });
    });

    it(`Location card #${index} should have Service times`, function() {
      cy.get('#section-locations > .card').eq(index).as(`${name}Card`)
        .within(() => {
          cy.get('[data-automation-id="location-service-times"]').as(`${name}ServiceTimes`)
            .normalizedText().should('contain', normalizeText(location.service_times.text));
        });
    });

    it(`Location card #${index} should not have a distance`, function() {
      cy.get('#section-locations > .card').eq(index).as(`${name}Card`)
        .should('not.have.attr', 'data-distance');
      cy.get(`@${name}Card`).find('.distance').should('not.exist');
    });
  });
});