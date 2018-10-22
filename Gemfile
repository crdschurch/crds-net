source "https://rubygems.org"

gem "jekyll", "~> 3.7.4"
gem 'activesupport'

group :jekyll_plugins do
  gem 'jekyll-assets'
  # gem 'crds-styles', path: File.join(File.dirname(__FILE__), '../crds-styles')
  # gem 'crds-styles', git: 'https://github.com/crdschurch/crds-styles.git', branch: 'development'
  gem 'crds-styles', git: 'https://github.com/crdschurch/crds-styles.git', tag: 'v3.0.6'
  gem "jekyll-contentful", git: 'https://github.com/crdschurch/jekyll-contentful.git', tag: '1.1.0'
  gem "jekyll-crds", "~> 0.0.1", git: 'https://github.com/crdschurch/jekyll-crds.git', branch: 'master'
  gem "jekyll-placeholders", "~> 0.0.1", github: 'ample/jekyll-placeholders'
  gem "jekyll-cloudsearch", github: 'crdschurch/jekyll-cloudsearch', tag: '0.0.3'

end

group :test do
  gem 'rspec'
  gem 'guard-rspec'
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem "wdm", "~> 0.1.0" if Gem.win_platform?
