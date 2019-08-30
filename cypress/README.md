# Cypress
## Environment setup

Environment variables needed to run locally:
```bash
CYPRESS_CONTENTFUL_ACCESS_TOKEN
CYPRESS_CONTENTFUL_SPACE_ID
CYPRESS_FRED_FLINTSTONE_PW
```


Cypress has a couple different ways to handle environment variable setup found [here](https://docs.cypress.io/guides/guides/environment-variables.html#Setting).
The above variables assume you're using [Option #3](https://docs.cypress.io/guides/guides/environment-variables.html#Option-3-CYPRESS).
If you decide to use another method, please be sure these variables are *not* checked into github.

Environment variables set in Netlify to run Cypress through Travis.ci:
```bash
CYPRESS_CONFIG_FILE #int_crossroads, demo_crossroads
CONTENTFUL_ACCESS_TOKEN
CONTENTFUL_SPACE_ID
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
npx cypress open
```

or headless with:

```bash
npx cypress run --browser chrome
```

To run or open in an environment other than int, specifiy the /config file to use.
ex. to run headless in demo:
```
npx cypress open --env useConfig=demo_crossroads
```

To customize a Cypress run beyond what's defined, check out their documentation [here](https://docs.cypress.io/guides/guides/command-line.html).