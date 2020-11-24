lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'crds-styles/version'

Gem::Specification.new do |s|
  s.name          = 'crds-styles'
  s.version       = CRDS::Styles::VERSION
  s.authors       = ['Crossroads Church']
  s.email         = 'hello@crossroads.net'
  s.summary       = 'Stylesheets to support Crossroads\' Digital Design Kit.'
  s.homepage      = 'https://design.crossroads.net/'
  s.license       = 'BSD-3-Clause'
  s.require_paths = ['lib']
  s.files         = `git ls-files`.split($/)

  s.add_runtime_dependency 'sass', '~> 3.2'

  s.add_dependency 'bootstrap-sass', '~> 3.3'

end