#!/bin/bash
# Channel that is output to logfile is stderr only
# Ships logs to logz.io if there is a failure

(bundle exec rspec 2> buildlog.txt &&
./bin/contentful-redirects 2> buildlog.txt &&
./bin/netlify-redirector 2> buildlog.txt &&
bundle exec jekyll crdsnope 2> buildlog.txt &&
bundle exec jekyll contentful -f 2> buildlog.txt &&
bundle exec jekyll build -- --update-search-index 2> buildlog.txt &&
bash ./cypress/kickOffCypress.sh 2> buildlog.txt &&
./bin/health-check.sh "we are crossroads") ||
./bin/logzio.sh
