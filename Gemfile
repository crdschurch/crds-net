source "https://rubygems.org"

gem "jekyll", "~> 4.0.0"
gem 'activesupport'
gem 'netlify-redirector', git: 'https://github.com/crdschurch/netlify-redirector.git'
gem 'httparty'
gem 'vcr'
gem 'webmock'
gem "rack", ">= 2.0.6"

group :jekyll_plugins do
  gem 'jekyll-sitemap'
  # gem 'jekyll-asset-pipeline', path: File.expand_path('../jekyll-asset-pipeline', __dir__)
  gem 'jekyll-asset-pipeline', git: 'https://github.com/crdschurch/jekyll-asset-pipeline', branch: 'jekyll-4' #tag: '0.0.4'
  # gem 'jekyll-contentful', path: File.expand_path('../jekyll-contentful', __dir__)
  gem "jekyll-contentful", git: 'https://github.com/crdschurch/jekyll-contentful.git', branch: 'jekyll-4'  #tag: '2.0.1'
  # gem 'jekyll-crds', path: File.expand_path('../jekyll-crds', __dir__)
  gem "jekyll-crds", git: 'https://github.com/crdschurch/jekyll-crds.git', branch: 'jekyll-4' #tag: '1.4.6'
  # gem 'jekyll-placeholders', path: File.expand_path('../jekyll-placeholders', __dir__)
  gem "jekyll-placeholders", git: 'https://github.com/crdschurch/jekyll-placeholders', branch: 'jekyll-4'
  # gem 'paging-mister-hyde', path: File.expand_path('../paging-mister-hyde', __dir__)
  gem "paging-mister-hyde", git: 'https://github.com/crdschurch/paging-mister-hyde.git', branch: 'jekyll-4'
end

group :test do
  gem 'rb-readline'
  gem 'rspec'
  gem 'guard-rspec'
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'wdm', '~> 0.1.0', platforms: :x64_mingw
