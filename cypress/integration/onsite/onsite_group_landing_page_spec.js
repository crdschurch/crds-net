import { OnsiteGroupQueryManager } from '../../Contentful/OnsiteGroupQueryManager';

describe('Given I navigate to /Onsite Group Page:', () => {
  let onsiteGroupList;
  before(() => {
    const osgqm = new OnsiteGroupQueryManager();
    osgqm.getListOfEntries('').then(OnsiteGroup => {
      onsiteGroupList = OnsiteGroup;
    });

    cy.visit('/groups/onsite');
  });

  it('Onsite Group card for Financial Peace should be last', function () {
    cy.get('ul').as('onsiteGroupCards');
    cy.get('@onsiteGroupCards').should('have.length', onsiteGroupList.length);
    const financialPeaceIndex = onsiteGroupList.length;
    cy.get('@onsiteGroupCards').eq(financialPeaceIndex - 1).find('a').should('have.attr', 'href', '/groups/onsite/financial-peace/uptown');
  });

  it('Test Onsite Group', function () {
    cy.get('h3').as('onsiteGroupCards');
    cy.get('@onsiteGroupCards').should('have.length', onsiteGroupList.length);
  });

  [0, 1, 2].forEach(index => {
    it(`Onsite card #${index} should have a Title`, () => {
      let onsite = onsiteGroupList[index];;
      let title = onsite.title.text;

      cy.get('h3').eq(index).as(`${title}Card`);
    });
  });
});
