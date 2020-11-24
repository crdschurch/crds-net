require 'spec_helper'

describe 'Jekyll::SubtopicsGenerator' do

  before do
    @site = JekyllHelper.scaffold(
      collections_dir: File.expand_path('../support/collections', __dir__),
      collections: %w(articles tags categories videos)
    )
    @generator = Jekyll::SubtopicsGenerator.new
    @generator.generate(@site)
  end

  it 'applies tags to each topic as appropriate' do
    expect(get_topic('Culture').data['tags']).to match_array([get_tag('Fun'), get_tag('Pop Culture')])
    expect(get_topic('Faith').data['tags']).to match_array([get_tag('Fear')])
  end

  it 'applies featured_media as the most recently published three docs' do
    culture_featured_titles = get_topic('Culture').data['featured_media'].collect { |d| d.data['title'] }
    expect(culture_featured_titles).to match_array(['Test Article 01'])
    # Only three docs are included.
    faith_featured_titles = get_topic('Faith').data['featured_media'].collect { |d| d.data['title'] }
    expect(faith_featured_titles).to match_array(['Test Article 05', 'Test Article 04', 'Test Article 03'])
  end

  it 'applies featured_tag_data to each topic' do
    # Culture doesn't have any featured tags
    expect(get_topic('Culture').data['featured_tag_data']).to eq([])
    # Faith has one featured tag: Fear. Its doc object and corresponding media
    # should be added to the topic's data set.
    tag_title = get_topic('Faith').data['featured_tag_data'].first['tag'].data['title']
    expect(tag_title).to eq('Fear')
    media_titles = get_topic('Faith').data['featured_tag_data'].first['media'].collect { |t| t.data['title'] }
    expect(media_titles).to match_array(['Test Article 05', 'Test Article 04', 'Test Article 03', 'Test Article 02'])
  end

  private

    def get_topic(title)
      @site.collections['categories'].docs.detect { |t| t.data['title'] == title }
    end

    def get_tag(title)
      @site.collections['tags'].docs.detect { |t| t.data['title'] == title }
    end

end
