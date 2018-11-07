#!/usr/bin/env ruby
require './lib/crds/redirects.rb'
Redirects.new().to_csv!
