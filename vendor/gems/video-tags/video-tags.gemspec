lib = File.expand_path('./lib', __dir__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'video-tags/version'

Gem::Specification.new do |s|
  s.name        = 'video-tags'
  s.version     = Jekyll::VideoTags::VERSION
  s.licenses    = ['BSD-3']
  s.summary     = "Dynamically builds pages for video tags"
  s.authors     = ["Ample"]
  s.email       = 'taylor@helloample.com'
  s.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  s.require_paths = ["lib"]

  s.add_dependency 'jekyll'
end