require 'spec_helper'

describe 'Jekyll::MediaTagsGenerator' do

  before do
    @site = JekyllHelper.scaffold(
      collections_dir: File.expand_path('../support/collections', __dir__),
      collections: %w(articles videos tags)
    )
    @generator = Jekyll::MediaTagsGenerator.new
    @generator.generate(@site)
  end

  # Pages are generated for each tag, even if the tag doesn't have any media
  # associated with it.
  it 'should generate pages for each tag' do
    urls = %w(
      /tags/empty/index.html
      /tags/fear/index.html
      /tags/fun/index.html
      /tags/pop-culture/index.html
    )
    expect(@site.pages.collect(&:url)).to match_array(urls)
  end

end
