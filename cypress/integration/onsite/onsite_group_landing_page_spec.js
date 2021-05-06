import { ContentfulQueryBuilder, normalizeText } from 'crds-cypress-contentful';

function sortByCategoryThenSlug(group1, group2){
  if(group1.category.title.text < group2.category.title.text){
    return -1;
  }
  if(group1.category.title.text > group2.category.title.text){
    return 1;
  }
  if(group1.slug.text < group2.slug.text){
    return -1;
  }
  if(group1.slug.text > group2.slug.text){
    return 1;
  }
  return 0;
}

describe('Given I navigate to /onsite/group Page:', function() {
  let onsiteGroupList;
  before(function() {
    // Get Onsite Groups
    const qb = new ContentfulQueryBuilder('onsite_group');
    qb.searchFor = 'fields.category[exists]=true';
    qb.select = 'fields.title,fields.category,fields.slug';
    qb.limit = 100;
    cy.task('getCNFLResource', qb.queryParams)
      .then((groups) => {
         onsiteGroupList = groups.filter(g => g.category.title.text == "Site-based");
      });
      const importDeclarationsError = /.*import declarations may only appear at top level of a module.*/;
      cy.ignoreMatchingErrors([importDeclarationsError]);
    cy.visit('/groups/onsite');
  });
  
  it('All Onsite group cards should be displayed', function() {
    cy.get('.onsite-group').as('onsiteGroupCards')
      .should('have.length', onsiteGroupList.length);
      
  });

  it('Onsite Group card for Financial Peace should be first', function() {
    let firstOnsiteGroup =     cy.get('.osg-row').as('onsiteGroupCards').first().find('a');
    cy.log(firstOnsiteGroup);
    cy.get('.osg-row').as('onsiteGroupCards')
      .first()
      .find('a')
      .should('have.attr', 'href', '/groups/site-based/COME-AS-YOU-ARE-FLORENCE-2019/columbus');
  });

 [3].forEach((index) => {    
  it(`Verify Site-Based groups section is visible #${index} `, function() {
    let title = onsiteGroupList[index].title.text;
    cy.get('.osg-row h4').eq(index +1 ).as(`${title}Card`)
      .normalizedText()
      .should('eq', normalizeText(title));
    });
  })
});