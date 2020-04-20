import { OnsiteGroupQueryManager } from '../../Contentful/OnsiteGroupQueryManager';
const errorsToIgnore = [/.*Cannot set property\W+\w+\W+of undefined.*/];

describe('Given I navigate to /Onsite Group Page:', function () {
    let onsiteGroupList;
    before(function () {
      const osgqm = new OnsiteGroupQueryManager();
      osgqm.getListOfEntries('').then(OnsiteGroup => {
         onsiteGroupList = OnsiteGroup;
      });
        
      cy.ignoreMatchingErrors(errorsToIgnore);
      cy.visit('/groups/onsite');
       
    });
 
    it ('Test Onsite Group', function(){
      cy.get('h3').as('onsiteCards');
      cy.get('@onsiteCards').should('have.length', onsiteGroupList.length);
    });

});