require 'spec_helper'

describe Jekyll::ArticleTags::Generator do

  before do
    @site = JekyllHelper.scaffold(
      collections_dir: File.expand_path('../support/collections', __dir__),
      collections: %w(articles categories tags)
    )
    @generator = Jekyll::ArticleTags::Generator.new
    @generator.generate(@site)
  end

  it 'should generate pages for article tags' do
    urls = %w(
      /articles/filters/cat-a+tag-a1/index.html
      /articles/filters/cat-b+tag-b2/index.html
      /articles/filters/cat-a/index.html
      /articles/filters/cat-b/index.html
    )
    expect(@site.pages.collect(&:url)).to match_array(urls)
  end

end
