function pageShouldNotBeFromMaestro(response){
  expect(response.headers['x-varnish']).not.to.exist;

  if(response.headers.via != undefined){
    expect(response.headers.via).not.to.contain('varnish');
  }

  expect(response.body).not.to.contain('meta name="Maestro"');
}

function pageShouldBeFromNetlify(response){
  expect(response.body).to.contain('meta name="Netlify"');
}

describe('Testing crds-net pages are not from Maestro:', function () {
  it('crossroads.net should not be rendered by Maestro', function () {
    cy.request('GET', '/')
      .then((response) => {
        pageShouldNotBeFromMaestro(response);
        pageShouldBeFromNetlify(response);
      });
  });

  it('/live should not be rendered by Maestro', function () {
    cy.request('GET', 'live/')
      .then((response) => {
        pageShouldNotBeFromMaestro(response);
        pageShouldBeFromNetlify(response);
      });
  });

  it('/live/stream should not be rendered by Maestro', function () {
    cy.request('GET', '/live/stream/')
      .then((response) => {
        pageShouldNotBeFromMaestro(response);
        pageShouldBeFromNetlify(response);
      });
  });

  it('/404 should not be rendered by Maestro', function () {
    cy.request('GET', '404/')
      .then((response) => {
        pageShouldNotBeFromMaestro(response);
        pageShouldBeFromNetlify(response);
      });
  });

  it('/family-meeting-stream should not be rendered by Maestro', function () {
    cy.request('GET', 'family-meeting-stream/')
      .then((response) => {
        pageShouldNotBeFromMaestro(response);
        pageShouldBeFromNetlify(response);
      });
  });

  it('/locations should not be rendered by Maestro', function () {
    cy.request('GET', 'locations/')
      .then((response) => {
        pageShouldNotBeFromMaestro(response);
        pageShouldBeFromNetlify(response);
      });
  });

  it('/updates should not be rendered by Maestro', function () {
    cy.request('GET', 'updates/')
      .then((response) => {
        pageShouldNotBeFromMaestro(response);
        pageShouldBeFromNetlify(response);
      });
  });
});

describe('Testing crds-net-shared pages are not rendered by Maestro:', function () {
  it('/atriumevents should not be rendered by Maestro', function () {
    cy.request('GET', 'atriumevents/')
      .then((response) => {
        pageShouldNotBeFromMaestro(response);
        pageShouldBeFromNetlify(response);
      });
  });

  it('/womancamp should not be rendered by Maestro', function () {
    cy.request('GET', 'womancamp/')
      .then((response) => {
        pageShouldNotBeFromMaestro(response);
        pageShouldBeFromNetlify(response);
      });
  });

  it('/undivided should not be rendered by Maestro', function () {
    cy.request('GET', 'undivided/')
      .then((response) => {
        pageShouldNotBeFromMaestro(response);
        pageShouldBeFromNetlify(response);
      });
  });

  it('/obsessed should not be rendered by Maestro', function () {
    cy.request('GET', 'obsessed/')
      .then((response) => {
        pageShouldNotBeFromMaestro(response);
        pageShouldBeFromNetlify(response);
      });
  });
});