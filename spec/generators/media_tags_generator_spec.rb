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
      /media/tags/empty/index.html
      /media/tags/fear/index.html
      /media/tags/fun/index.html
      /media/tags/pop-culture/index.html
    )
    expect(@site.pages.collect(&:url)).to match_array(urls)
  end

end
