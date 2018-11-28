#!/usr/bin/env bash

#Skip testing in Prod
#TODO will this work with $CRDS_APP_CLIENT_ENDPOINT too?
if [[ "$CRDS_APP_CLIENT_ENDPOINT" = *"www.crossroads.net" ]];
then
    exit 0
fi

#Test the live site if we're deploying to it, else test Netlify's preview
if [ "$CONTEXT" != "production" ];#try again with better syntax
then
    test_this_URL=$CRDS_APP_CLIENT_ENDPOINT
else
    test_this_URL=$DEPLOY_URL
fi

body="{\"request\": { \"branch\":\"$HEAD\", \"config\": {\"env\": { \"baseURL\": \"$test_this_URL\", \"contentfulSpaceId\": \"$CONTENTFUL_SPACE_ID\", \"contentfulEnv\": \"$CONTENTFUL_ENV\", \"contentfulToken\": \"$CONTENTFUL_ACCESS_TOKEN\", \"mediaEndpoint\": \"$CRDS_MEDIA_ENDPOINT\", \"NetlifyContext\": \"$CONTEXT\"}}}}"


curl -s -X POST \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-H "Travis-API-Version: 3" \
-H "Authorization: token $TRAVIS_CI" \
-d "$body" \
https://api.travis-ci.org/repo/crdschurch%2Fcrds-net/requests
