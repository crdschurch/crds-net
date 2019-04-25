#!/bin/bash
# Channel that is output to logfile is stderr only
# std out is output to /dev/null
# Ships logs to logz.io if there is a failure

(bundle exec rspec 1> /dev/null 2>> buildlog.txt &&
./bin/contentful-redirects 1> /dev/null 2>> buildlog.txt &&
./bin/netlify-redirector 1> /dev/null 2>> buildlog.txt &&
bundle exec jekyll crds 1> /dev/null 2>> buildlog.txt &&
bundle exec jekyll contentful -f 1> /dev/null 2>> buildlog.txt &&
bundle exec jekyll build -- --update-search-index 1> /dev/null 2>> buildlog.txt &&
bash ./cypress/kickOffCypress.sh 1> /dev/null 2>> buildlog.txt &&
./bin/health-check.sh "we are crossroads" 1> /dev/null 2>> buildlog.txt) ||
./bin/logzio.sh
