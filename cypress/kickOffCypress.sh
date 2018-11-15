#!/usr/bin/env bash

if [ "$HEAD" = "development" ]
then
    body="{\"request\": { \"branch\":\"$HEAD\", \"config\": {\"env\": { \"baseURL\": \"https://int.crossroads.net\"}}}}"
elif [ "$HEAD" = "release" ]
then
    body="{\"request\": { \"branch\":\"$HEAD\", \"config\": {\"env\": { \"baseURL\": \"https://demo.crossroads.net\"}}}}"
else
    body="{\"request\": { \"branch\":\"$HEAD\", \"config\": {\"env\": { \"baseURL\": \"$DEPLOY_URL\"}}}}"
fi

if [ "$HEAD" != "master" ]
then
    curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "Travis-API-Version: 3" \
    -H "Authorization: token $TRAVIS_CI" \
    -d "$body" \
    https://api.travis-ci.org/repo/crdschurch%2Fcrds-net/requests
 fi