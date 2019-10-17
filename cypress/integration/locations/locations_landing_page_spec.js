import { ImageDisplayValidator } from '../../Contentful/ImageDisplayValidator';
import { LocationQueryManager } from 'crds-cypress-contentful';

describe('Given I navigate to /locations and do not search:', function () {
  let locationList;
  before(function () {
    const lqm = new LocationQueryManager();
    lqm.getListOfEntries(lqm.query.orderBy.nameThenSlug).then(locations => {
      locationList = locations;
    });

    const errorsToIgnore = [/.*Cannot read property\W+\w+\W+of undefined.*/, /.*Cannot convert undefined or null to object.*/];
    cy.ignoreMatchingErrors(errorsToIgnore);
    cy.visit('/locations');
  });

  it('Location card for Anywhere should be displayed after standard location cards', function (){
    cy.get('#section-locations > .card').as('locationCards');

    cy.get('@locationCards').should('have.length.gt', locationList.length);
    const anywhereIndex = locationList.length;
    cy.get('@locationCards').eq(anywhereIndex).find('[data-automation-id="anywhere-name"]').should('have.attr', 'href', '/live');
  });

  [0,1,2].forEach(index => {
    let location;
    let name;
    before(function () {
      location = locationList[index];
      name = location.name.text;
    });

    it(`Location card #${index} should have a Name`, function () {
      cy.get('#section-locations > .card').eq(index).as(`${name}Card`);
      cy.get(`@${name}Card`).find('[data-automation-id="location-name"]').as(`${name}Title`);
      cy.get(`@${name}Title`).should('have.text', name);
      cy.get(`@${name}Title`).should('have.attr', 'href').and('contain', location.slug.text);
    });

    it(`Location card #${index} should have an Image`, function () {
      cy.get('#section-locations > .card').eq(index).as(`${name}Card`);
      cy.get(`@${name}Card`).find('[data-automation-id="location-image"]').find('img').as(`${name}Image`);
      location.imageLink.getResource().then(image =>{
        new ImageDisplayValidator(`${name}Image`, false).shouldHaveImgixImage(image);
      });
    });

    it(`Location card #${index} should have an Address and a link to Map`, function () {
      cy.get('#section-locations > .card').eq(index).as(`${name}Card`);
      cy.get(`@${name}Card`).find('[data-automation-id="location-address"]').as(`${name}Address`);

      cy.get(`@${name}Address`).normalizedText().should('contain', location.address.unformattedText);

      cy.get(`@${name}Card`).find('[data-automation-id="location-map-url"]').as(`${name}MapLink`);
      cy.get(`@${name}MapLink`).should('have.attr', 'href', location.mapURL.text);
    });

    it(`Location card #${index} should have Service times`, function () {
      cy.get('#section-locations > .card').eq(index).as(`${name}Card`);
      cy.get(`@${name}Card`).find('[data-automation-id="location-service-times"]').as(`${name}ServiceTimes`);
      cy.get(`@${name}ServiceTimes`).normalizedText().should('contain', location.serviceTimes.unformattedText);
    });

    it(`Location card #${index} should not have a distance`, function () {
      cy.get('#section-locations > .card').eq(index).as(`${name}Card`);
      cy.get(`@${name}Card`).should('not.have.attr', 'data-distance');
      cy.get(`@${name}Card`).find('.distance').should('not.exist');
    });
  });
});
