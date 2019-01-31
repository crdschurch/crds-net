## Setup

Create a cypress.env.json file with the following content (Contentful values can be found directly in Contentful):

```bash
{
    "CONTENTFUL_SPACE_ID": "...",
    "CONTENTFUL_ENV": "...",
    "CONTENTFUL_ACCESS_TOKEN": "...",
    "CRDS_MEDIA_ENDPOINT": "mediaint"
    "TEST_USER_PW": "..."
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