# Cypress
## Environment setup

Environment variables needed to run locally:
```bash
CYPRESS_CONTENTFUL_ACCESS_TOKEN
CYPRESS_CONTENTFUL_SPACE_ID
CYPRESS_CONTENTFUL_ENV
CYPRESS_CRDS_MEDIA_ENDPOINT #mediaint or mediademo
CYPRESS_CRDS_ENV #int or demo
CYPRESS_FRED_FLINTSTONE_PW
```

Cypress has a couple different ways to handle environment variable setup found [here](https://docs.cypress.io/guides/guides/environment-variables.html#Setting).
The above variables assume you're using [Option #3](https://docs.cypress.io/guides/guides/environment-variables.html#Option-3-CYPRESS).
If you decide to use another method, please be sure these variables are *not* checked into github.

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

Environment variables to set in Travis.ci:
```bash
cypressDashboard #Cypress's dashboard record key for this repo
FRED_FLINTSTONE_PW
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