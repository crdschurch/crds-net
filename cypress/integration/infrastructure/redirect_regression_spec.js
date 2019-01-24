describe('Testing navigation between pages:', function (){
  it('(DE6317) Using the Crossroads logo to navigate out of /search should land on the Netlify homepage', function (){
    cy.visit('/');
    //check is netlify
    cy.visit('search/');
    //check is netlify
    //click crossroads logo
    //check on homepage (don't rely on url)
    //check is netlify
  });

  it('(DE6319) Using the Crossroads logo to navigate out of /corkboard should land on the Netlify homepage', function (){
    cy.visit('/');
    //check is netlify
    cy.visit('corkboard/');
    //check is netlify
    //click crossroads logo
    //check on homepage (don't rely on url)
    //check is netlify
  });

  it('(DE6321) Navigating to a location with a known redirect should land on the redirected page served by Netlify', function (){
    //first check andover/lexington redirect exists
    //visit /andover
    //check is /lexington
    //check is netlify
  });
});