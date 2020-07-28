source "https://rubygems.org"

gem "jekyll", "~> 4.0.0"
gem 'activesupport'
gem 'netlify-redirector', git: 'https://github.com/crdschurch/netlify-redirector.git'
gem 'httparty'
gem 'vcr'
gem 'webmock'
gem "rack", ">= 2.0.6"

group :jekyll_plugins do
  gem 'jekyll-sitemap', git: 'https://github.com/ample/jekyll-sitemap.git'
  # gem 'jekyll-sitemap', path: File.expand_path('../jekyll-sitemap', __dir__)
  gem 'jekyll-asset-pipeline', git: 'https://github.com/crdschurch/jekyll-asset-pipeline', tag: '1.0.0'
  # gem 'jekyll-contentful', path: File.expand_path('../jekyll-contentful', __dir__)
  gem "jekyll-contentful", git: 'https://github.com/crdschurch/jekyll-contentful.git', tag: '3.0.0'
  # gem 'jekyll-crds', path: File.expand_path('../jekyll-crds', __dir__)
  gem "jekyll-crds", git: 'https://github.com/crdschurch/jekyll-crds.git', tag: '2.1.1'
  # gem 'jekyll-placeholders', path: File.expand_path('../jekyll-placeholders', __dir__)
  gem "jekyll-placeholders", git: 'https://github.com/ample/jekyll-placeholders', tag: '1.0.0'
  # gem 'paging-mister-hyde', path: File.expand_path('../paging-mister-hyde', __dir__)
  gem "paging-mister-hyde", git: 'https://github.com/ample/paging-mister-hyde.git', tag: '1.0.0'
end

group :test do
  gem 'rb-readline'
  gem 'rspec'
  gem 'guard-rspec'
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'wdm', '~> 0.1.0', platforms: :x64_mingw
