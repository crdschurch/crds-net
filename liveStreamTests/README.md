## Live Stream Encoding Test

Intended to be run in production before the Live Stream on Sunday to confirm the latest message was successfully encoded.

If tests fail, notifications will be sent via Slack and email.

### Environment Variables

```
config_file #int_crossroads, demo_crossroads or prod_crossroads
VAULT_ROLE_ID
VAULT_SECRET_ID
```

### Running locally

There are three pre-defined scripts in the package.json file for running tests in headless mode each environment. Run them with 

```bash
$npm run int_crossroads
$npm run demo_crossroads
$npm run prod_crossroads
```

To run using the Cypress test runner, copy the package.json file script for the environment and replace the "run" with "open".

```bash
npx cypress open --config-file ./cypress/config/int_crossroads.json
```

### Running on Docker

Once environment variables are set, the suite can be run on Docker with:

```
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up --abort-on-container-exit
```