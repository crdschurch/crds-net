#!/usr/bin/env bash
#Skip all testing in Prod
if [[ "$CRDS_APP_CLIENT_ENDPOINT" = *"www.crossroads.net" ]];
then
    exit 0
fi

#Skip all testing against preview branches
if [ "$CONTEXT" != "production" ];
then
    exit 0
fi

#Below is temporarily disabled until tests are more stable
#Test the live site if we're deploying to it, else test Netlify's preview
# if [ "$CONTEXT" == "production" ];
# then
#     test_this_URL=$CRDS_APP_CLIENT_ENDPOINT
# else
#     test_this_URL=$DEPLOY_URL
# fi

test_this_URL=$CRDS_APP_CLIENT_ENDPOINT
body="{\"request\": { \"branch\":\"$HEAD\", \"config\": {\"env\": { \"baseURL\": \"$test_this_URL\", \"contentfulSpaceId\": \"$CONTENTFUL_SPACE_ID\", \"contentfulEnv\": \"$CONTENTFUL_ENV\", \"contentfulToken\": \"$CONTENTFUL_ACCESS_TOKEN\", \"mediaEndpoint\": \"$CRDS_MEDIA_ENDPOINT\", \"DEBUG_NetlifyContext\": \"$CONTEXT\"}}}}"

curl -s -X POST \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-H "Travis-API-Version: 3" \
-H "Authorization: token $TRAVIS_CI" \
-d "$body" \
https://api.travis-ci.org/repo/crdschurch%2Fcrds-net/requests
