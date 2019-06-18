## Live Stream Encoding Test

Intended to be run in production before the Live Stream on Sunday to confirm the latest message was successfully encoded.

If tests fail, notifications will be sent via Slack and email.

### Environment Variables

```
config_file #int_crossroads or prod_crossroads
BITMOVIN_API_KEY
CROSSROADS_API_ENDPOINT
SLACK_WEBHOOK_URL
CONTENTFUL_ACCESS_TOKEN
CONTENTFUL_SPACE_ID
SENDGRID_USER
SENDGRID_PW
```

### Running on Docker

Once environment variables are set, the suite can be run on Docker with:

```
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up --abort-on-container-exit
```