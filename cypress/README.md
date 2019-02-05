# Cypress
## Environment setup

Environment variables needed to run locally:
```bash
CYPRESS_CONTENTFUL_ACCESS_TOKEN
CYPRESS_CONTENTFUL_SPACE_ID
CYPRESS_CONTENTFUL_ENV
CYPRESS_CRDS_MEDIA_ENDPOINT #mediaint or mediademo
CYPRESS_CRDS_ENV #int or demo
```


Environment variables set in Netlify to run Cypress through Travis.ci:
```bash
CONTENTFUL_ACCESS_TOKEN
CONTENTFUL_SPACE_ID
CONTENTFUL_ENV
CRDS_MEDIA_ENDPOINT #mediaint or mediademo
CRDS_ENV #int or demo
RUN_CYPRESS #true/false
TRAVIS_CI #Travis's API Authentication token
CYPRESS_INSTALL_BINARY = 0
```

## Run Locally

After defining local environment variables, run the Cypress UI with:

```bash
npm run cypress:open
```

or headless with:

```bash
npm run cypress:runLocal
```

For more predefined npm scripts to run Cypress see the scripts section of the package.json file.

To customize a Cypress run beyond what's defined, check out their documentation [here](https://docs.cypress.io/guides/guides/command-line.html).

//old

## Setup

Create a cypress.env.json file with the following content (Contentful values can be found directly in Contentful):

```bash
{
    "CONTENTFUL_SPACE_ID": "...",
    "CONTENTFUL_ENV": "...",
    "CONTENTFUL_ACCESS_TOKEN": "...",
    "CRDS_MEDIA_ENDPOINT": "mediaint"
    "TEST_USER_PW": "..."
    "CRDS_ENV": "int"
}
```

cypress.env.json must be in the same folder as cypress.json. Do NOT store this file in git.

Alternaively you can add these to your system's environment variables, but in this case they'd need to be prefixed with 'CYPRESS_' to be recognized.

## Run Tests

To open the Cypress interface for running tests:
```bash
npm run cypress:open
```

To run all Cypress test suites headless:
```bash
npm run cypress:runLocal
```

For more predefined npm scripts to run Cypress see the scripts section of the package.json file.

To customize a Cypress run beyond what's defined, check out their documentation [here](https://docs.cypress.io/guides/guides/command-line.html).