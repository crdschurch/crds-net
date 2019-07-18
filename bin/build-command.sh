#!/bin/bash
printf "Setting up environment variables... \n"
VAULT_TOKEN=$(curl -X POST -s \
  $VAULT_ENDPOINT/v1/auth/approle/login \
  -d "{
        \"role_id\": \"$VAULT_ROLE_ID\",
        \"secret_id\": \"$VAULT_SECRET_ID\"
}" | jq -r '.auth.client_token')

VAR_ARRAY=$(curl -X GET -s \
  $VAULT_ENDPOINT/v1/kv/data/$VAULT_BUCKET_NAME \
  -H "x-vault-token: $VAULT_TOKEN" | jq -r '.data.data')

export KEYS=$(echo $VAR_ARRAY | jq -r 'keys | .[]')

printf "Variables set:\n"

for key in $KEYS; do
    value=$(echo $VAR_ARRAY | jq -r --arg key "$key" '.[$key]')
    export $key=$value
    printf "$key\n"
done
printf "Done setting environment variables! \n"

{
  bundle exec rspec &&
  ./bin/contentful-redirects &&
  ./bin/netlify-redirector &&
  bundle exec jekyll crds &&
  bundle exec jekyll contentful -f &&
  bundle exec jekyll build -- --update-search-index &&
  bash ./cypress/kickOffCypress.sh &&
  ./bin/prerenderio-bust.sh &&
  ./bin/health-check.sh "we are crossroads"
} 2>buildlog.txt
./bin/logzio.sh
