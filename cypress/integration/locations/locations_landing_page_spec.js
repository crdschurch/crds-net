import { ContentfulQueryBuilder, normalizeText } from 'crds-cypress-contentful';

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

    cy.visit('/locations');
  });

  it('Location card for Anywhere should be displayed after standard location cards', function() {
    cy.get('#section-locations .card').as('locationCards');
    const anywhereIndex = 0;
    cy.get('@locationCards').eq(anywhereIndex)
      .find('[data-automation-id="anywhere-name"]')
      .should('have.attr', 'href', '/live');
  });

  [1, 2, 3].forEach((index) => {
    let location;
    let name;
    before(function() {
      location = locationList[index - 1];
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
      cy.get('#section-locations > .card').eq(index).as(`${name}Card`)
        .within(() => {
          cy.imgixShouldRunOnElement('[data-automation-id="location-image"] img', location.image);
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
