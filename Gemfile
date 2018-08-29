source "https://rubygems.org"

gem "jekyll", "~> 3.7.3"
gem 'activesupport'

group :jekyll_plugins do
  gem 'jekyll-assets'
  gem 'crds-styles', git: 'https://github.com/crdschurch/crds-styles.git', branch: 'development'
  gem "jekyll-contentful", "~> 1.0.0", git: 'https://github.com/crdschurch/jekyll-contentful.git', branch: 'master'
  gem "jekyll-crds", "~> 0.0.1", git: 'https://github.com/crdschurch/jekyll-crds.git', branch: 'master'
end

group :test do
  gem 'rspec'
  gem 'guard-rspec'
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem "wdm", "~> 0.1.0" if Gem.win_platform?
