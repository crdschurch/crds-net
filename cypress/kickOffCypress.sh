#!/usr/bin/env bash

body="{\"request\": { \"branch\":\"$HEAD\", \"config\": {\"env\": { \"baseURL\": \"$DEPLOY_URL\", \"contentfulSpaceId\": \"$CONTENTFUL_SPACE_ID\", \"contentfulEnv\": \"$CONTENTFUL_ENV\", \"contentfulToken\": \"$CONTENTFUL_ACCESS_TOKEN\", \"mediaEndpoint\": \"$CRDS_MEDIA_ENDPOINT\"}}}}"

#Run Cypress tests against Netlify's preview build unless we're deploying to Prod
if [ "$CRDS_APP_DOMAIN" != "www.crossroads.net" ]
then
    curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "Travis-API-Version: 3" \
    -H "Authorization: token $TRAVIS_CI" \
    -d "$body" \
    https://api.travis-ci.org/repo/crdschurch%2Fcrds-net/requests
 fi