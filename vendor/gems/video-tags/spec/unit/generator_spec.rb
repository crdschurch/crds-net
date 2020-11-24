require 'spec_helper'

describe Jekyll::VideoTags::Generator do

  before do
    @site = JekyllHelper.scaffold(
      collections_dir: File.expand_path('../support/collections', __dir__),
      collections: %w(videos tags)
    )
    @generator = Jekyll::VideoTags::Generator.new
    @generator.generate(@site)
  end

  it 'should generate pages for video tags' do
    urls = %w(
      /videos/tags/collection-01/index.html
    )
    expect(@site.pages.collect(&:url)).to match_array(urls)
  end

end
