source 'https://rubygems.org'

# ---------------------------------------- | Base

gem 'jekyll', '~> 4.0.0'

# ---------------------------------------- | Utilities

gem 'activesupport'
gem 'netlify-redirector', git: 'https://github.com/crdschurch/netlify-redirector.git'
gem 'httparty'
gem 'vcr'
gem 'webmock'
gem "rack", ">= 2.0.6"
gem 'hashie'
gem 'uglifier'
gem 'webvtt-ruby'

# To fix security vulnerability
gem 'sprockets', '~> 3.7.2'

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Performance-booster for watching directories on Windows
gem 'wdm', '~> 0.1.0', platforms: [:mingw, :mswin, :x64_mingw]

gem 'dotenv'

# For uploading to Monetate SFTP
gem 'net-sftp'

group :development do
  gem 'pry'
  gem 'pry-nav'
  gem 'rb-readline'
end

# ---------------------------------------- | Testing

group :test do
  gem 'rspec'
  gem 'guard-rspec'
  gem 'launchy'
end

# ---------------------------------------- | Plugins

group :jekyll_plugins do
  gem 'jekyll-sitemap'
  gem 'jekyll-include-cache'

  # gem 'jekyll-asset-pipeline', path: File.expand_path('../jekyll-asset-pipeline', __dir__)
  gem 'jekyll-asset-pipeline', git: 'https://github.com/crdschurch/jekyll-asset-pipeline', tag: '1.0.0'
  # gem 'jekyll-contentful', path: File.expand_path('../jekyll-contentful', __dir__)
  gem "jekyll-contentful", git: 'https://github.com/crdschurch/jekyll-contentful.git', tag: '3.2.0'
  # gem 'jekyll-crds', path: File.expand_path('../jekyll-crds', __dir__)
  gem "jekyll-crds", git: 'https://github.com/crdschurch/jekyll-crds.git', tag: '2.3.2'
  # gem 'jekyll-placeholders', path: File.expand_path('../jekyll-placeholders', __dir__)
  gem "jekyll-placeholders", git: 'https://github.com/ample/jekyll-placeholders', tag: '1.0.0'
  # gem 'paging-mister-hyde', path: File.expand_path('../paging-mister-hyde', __dir__)
  gem "paging-mister-hyde", git: 'https://github.com/ample/paging-mister-hyde.git', tag: '1.0.0'

  gem 'jekyll-redirect-from'
  gem 'jekyll-feed', '~> 0.6'
  gem 'jekyll-coffeescript'
  gem 'article-tags', '~> 0.0.1', path: File.expand_path('./vendor/gems/article-tags', __dir__)
  gem 'video-tags', '~> 0.0.1', path: File.expand_path('./vendor/gems/video-tags', __dir__)
end
