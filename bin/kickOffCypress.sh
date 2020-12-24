#!/bin/bash
shopt -s nocasematch; #ignore case

#Skip all testing against preview branches
if [ "$CONTEXT" != "development" ];
then
    exit 0
fi

body="{\"request\": { \"branch\":\"$HEAD\", \"config\": {\"env\": { \"RUN_CYPRESS\": \"$RUN_CYPRESS\", \"CYPRESS_configFile\": \"$CYPRESS_CONFIG_FILE\", \"DEBUG_NetlifyContext\": \"$CONTEXT\"}}}}"

curl -s -X POST \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-H "Travis-API-Version: 3" \
-H "Authorization: token $TRAVIS_CI" \
-d "$body" \
https://api.travis-ci.net/repo/crdschurch%2Fcrds-net/requests
