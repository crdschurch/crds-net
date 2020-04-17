
import { OnsiteGroupQueryManager } from '../../Contentful/OnsiteGroupQueryManager';

describe('Given I navigate to /Onsite Group Page:', function () {
    let onsiteGroupList;
    before(function () {
      const osgqm = new OnsiteGroupQueryManager();
      osgqm.getListOfEntries(osgqm.query.orderBy.title).then(OnsiteGroup => {
         onsiteGroupList = OnsiteGroup;
      });
    const errorsToIgnore = [/.*Cannot set property\W+\w+\W+of undefined.*/, /.* Cannot set property 'status' of undefined.*/];
    cy.ignoreMatchingErrors(errorsToIgnore);
          cy.visit('/groups/onsite');
       
    });
   
   
    it ('Test Onsite Group', function(){
    const errorsToIgnore = [/.*Cannot set property\W+\w+\W+of undefined.*/, /.* Cannot set property 'status' of undefined.*/];
    cy.ignoreMatchingErrors(errorsToIgnore);
      cy.get('h3').as('onsiteCards');
      cy.get('@onsiteCards').should('have.length', onsiteGroupList.length);
    });

});