import { ContentfulQueryBuilder } from 'crds-cypress-contentful';
//TODO fixup aliases once cypress updated
describe('Given I navigate to /Onsite Group Page:', () => {
  let onsiteGroupList;
  before(() => {
    // Get Onsite Groups
    const qb = new ContentfulQueryBuilder('onsite_group');
    qb.select = 'fields.title';
    qb.limit = 1000;
    cy.task('getCNFLResource', qb.queryParams)
      .then((gl) => {
        onsiteGroupList = gl;
      });

    cy.visit('/groups/onsite');
  });

  it('Onsite Group card for Financial Peace should be last', function() {
    cy.get('ul').as('onsiteGroupCards');
    cy.get('@onsiteGroupCards').should('have.length', onsiteGroupList.length);
    const financialPeaceIndex = onsiteGroupList.length;
    cy.get('@onsiteGroupCards').eq(financialPeaceIndex - 1).find('a').should('have.attr', 'href', '/groups/onsite/financial-peace/uptown');
  });

  it('Test Onsite Group', function() {
    cy.get('h3').as('onsiteGroupCards');
    cy.get('@onsiteGroupCards').should('have.length', onsiteGroupList.length);
  });

  [0, 1, 2].forEach((index) => {
    it(`Onsite card #${index} should have a Title`, function() {
      let onsite = onsiteGroupList[index];
      let title = onsite.title.text;

      cy.get('h3').eq(index).as(`${title}Card`);
    });
  });
});
