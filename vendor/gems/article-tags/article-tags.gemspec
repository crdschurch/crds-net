lib = File.expand_path('./lib', __dir__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'article-tags/version'

Gem::Specification.new do |s|
  s.name        = 'article-tags'
  s.version     = Jekyll::ArticleTags::VERSION
  s.licenses    = ['BSD-3']
  s.summary     = "Dynamically builds pages for article tags"
  s.authors     = ["Ample"]
  s.email       = 'taylor@helloample.com'
  s.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  s.require_paths = ["lib"]

  s.add_dependency 'jekyll'
end
