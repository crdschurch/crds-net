source "https://rubygems.org"

gem "jekyll", "~> 3.7.4"
gem 'activesupport'
gem 'netlify-redirector', git: 'https://github.com/crdschurch/netlify-redirector.git'
gem 'httparty'
gem 'vcr'
gem 'webmock'
gem "rack", ">= 2.0.6"

group :jekyll_plugins do
  gem 'jekyll-sitemap'
  gem 'jekyll-asset-pipeline', git: 'https://github.com/crdschurch/jekyll-asset-pipeline', tag: '0.0.4'
  # gem 'jekyll-contentful', path: File.expand_path('../jekyll-contentful', __dir__)
  gem "jekyll-contentful", git: 'https://github.com/crdschurch/jekyll-contentful.git', tag: '2.0.1'
  gem "jekyll-crds", git: 'https://github.com/crdschurch/jekyll-crds.git', tag: '1.4.6'
  gem "jekyll-placeholders", git: 'https://github.com/ample/jekyll-placeholders', tag: '0.0.1'
  gem "paging-mister-hyde", git: 'https://github.com/ample/paging-mister-hyde.git', tag: '0.2.0'
end

group :test do
  gem 'rb-readline'
  gem 'rspec'
  gem 'guard-rspec'
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'wdm', '~> 0.1.0', platforms: :x64_mingw
