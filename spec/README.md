# Cypress
## Environment setup

Environment variables needed to run locally:
```bash
VAULT_ROLE_ID
VAULT_SECRET_ID
```

Cypress has a couple different ways to handle environment variable setup found [here](https://docs.cypress.io/guides/guides/environment-variables.html#Setting).
The above variables assume you're using [Option #3](https://docs.cypress.io/guides/guides/environment-variables.html#Option-3-CYPRESS).
If you decide to use another method, please be sure these variables are *not* checked into github.

Environment variables set in Netlify to run Cypress through Travis.ci:
```bash
CYPRESS_configFile #ex. int_crossroads, demo_crossroads
VAULT_ROLE_ID
VAULT_SECRET_ID
RUN_CYPRESS #true/false
TRAVIS_CI #Travis's API Authentication token
CYPRESS_INSTALL_BINARY = 0 #Stop Cypress from installing in Netlify
```

Environment variables to set in Travis.ci:
```bash
cypressDashboard #Cypress's dashboard record key for this repo
```

## Run Locally

Define the local environment variables listed above, then run Cypress tests against the int environment with:

```bash
npx cypress open --config-file ./cypress/config/int_crossroads.json
```

or in headless mode with:

```bash
npx cypress run --config-file ./cypress/config/int_crossroads.json
```

To run the tests against a different environment, replace the `int_crossroad.json` config-file with another Cypress config file in the `./cypress/config/` folder. Note that running tests against a locally hosted environment is not yet fully supported, and tests with non-crds-net links or redirects will likely fail.

To customize a Cypress run beyond what's defined, check out their documentation [here](https://docs.cypress.io/guides/guides/command-line.html).