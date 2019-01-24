function responseShouldNotBeFromMaestro(response){
  expect(response.headers['x-varnish']).not.to.exist;

  if(response.headers.via != undefined){
    expect(response.headers.via).not.to.contain('varnish');
  }
}

function pageShouldNotBeFromMaestro(response){
  expect(response.body).not.to.contain('meta name="Maestro"');
}

describe('Testing crds-net pages are not from Maestro:', function () {
  it('crossroads.net should not be rendered by Maestro', function () {
    cy.request('GET', '/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/live should not be rendered by Maestro', function () {
    cy.request('GET', 'live/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/live/stream should not be rendered by Maestro', function () {
    cy.request('GET', '/live/stream/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/404 should not be rendered by Maestro', function () {
    cy.request('GET', '404/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/family-meeting-stream should not be rendered by Maestro', function () {
    cy.request('GET', 'family-meeting-stream/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/locations should not be rendered by Maestro', function () {
    cy.request('GET', 'locations/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/updates should not be rendered by Maestro', function () {
    cy.request('GET', 'updates/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });
});

describe('Testing crds-net-shared pages are not rendered by Maestro:', function () {
  it('/atriumevents should not be rendered by Maestro', function () {
    cy.request('GET', 'atriumevents/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/womancamp should not be rendered by Maestro', function () {
    cy.request('GET', 'womancamp/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/undivided should not be rendered by Maestro', function () {
    cy.request('GET', 'undivided/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });

  it('/obsessed should not be rendered by Maestro', function () {
    cy.request('GET', 'obsessed/')
      .then((response) => {
        responseShouldNotBeFromMaestro(response);
        pageShouldNotBeFromMaestro(response);
      });
  });
});