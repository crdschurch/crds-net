//Check that pages, assets are being served by netlify
//request these directly, don't navigate to.
function responseShouldNotBeFromMaestro(response){
  expect(response.headers['x-varnish']).not.to.exist;

  if(response.headers.via != undefined){
    expect(response.headers.via).not.to.contain('varnish');
  }
}

function pageShouldNotBeFromMaestro(response){
  expect(response.body).not.to.contain('meta name="Maestro"');
}

describe.only('Testing crds-net pages are rendered by Netlify:', function () {
  it('crossroads.net should be rendered by Netlify', function () {
    cy.request('GET', '/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/live should be rendered by Netlify', function () {
    cy.request('GET', 'live/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/live/stream should be rendered by Netlify', function () {
    cy.request('GET', '/live/stream/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/404 should be rendered by Netlify', function () {
    cy.request('GET', '404/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/family-meeting-stream should be rendered by Netlify', function () {
    cy.request('GET', 'family-meeting-stream/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/locations should be rendered by Netlify', function () {
    cy.request('GET', 'locations/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/updates should be rendered by Netlify', function () {
    cy.request('GET', 'updates/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });
});

describe('Testing crds-net-shared pages are rendered by Netlify:', function () {
  it('???.net should be rendered by Netlify', function () {

  });
  //other pages in crds-net-shared
});

describe('Testing crds-net assets are rendered by Netlify:', function () {
  it('????', function () {
    //When a page is requested the asset url is something like https://int.crossroads.net/assets/set-redirect-url-18c889f9b95466923c76cebb.js
    //postmanning https://int.crossroads.net/assets/set-redirect-url.js gets a document but with a different id at the end. Is there a way to get the id from somewhere?

  });
  //what will these look like if served from Maestro?
});