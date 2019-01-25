describe('Testing navigation between pages requiring authentication:', function (){
  it.only('(DE6319) Using the Crossroads logo to navigate out of /corkboard while signed in should land on the Netlify homepage', function (){
    cy.login('mpcrds+auto+fredflintstone@gmail.com', Cypress.env('TEST_USER_PW'));

    //signin - manually tested through homepage first but might api work?
    cy.visit('/corkboard');
    //check is netlify
    //click crossroads logo
    //check on homepage(not 404)  - defect was for oops page, but the oops page is angular
    //check is netlify
  });

  //create a test for each entry in the profile list
  it('(DE6320) ', function (){

  });

  it('', function (){
    //signin/signout issues?
  });
});