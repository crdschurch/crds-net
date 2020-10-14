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
    qb.select = 'fields.title,fields.category,fields.slug';
    qb.limit = 1000;
    cy.task('getCNFLResource', qb.queryParams)
      .then((groups) => {
        onsiteGroupList = groups.sort(sortByCategoryThenSlug);
      });

    cy.visit('/groups/onsite');
  });
  
  it('All Onsite group cards should be displayed', function() {
    cy.get('.col-md-4').as('onsiteGroupCards')
      .should('have.length', onsiteGroupList.length);
  });

  it('Onsite Group card for Financial Peace should be first', function() {
    cy.get('.col-md-4').as('onsiteGroupCards')
      .first()
      .find('a')
      .should('have.attr', 'href', '/groups/onsite/financial-peace/uptown');
  });

  [1,2,3,].forEach((index) => {    
    it(`Onsite card #${index} should have a Title`, function() {
      let title = onsiteGroupList[index + 8].title.text;

      cy.get('.col-md-4 h3').eq(index).as(`${title}Card`)
        .normalizedText()
        .should('eq', normalizeText(title));
    });
  });
});
