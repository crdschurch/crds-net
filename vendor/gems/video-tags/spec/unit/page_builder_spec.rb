require 'spec_helper'

describe Jekyll::VideoTags::PageBuilder do

  before do
    @site = JekyllHelper.scaffold(
      collections_dir: File.expand_path('../support/collections', __dir__),
      collections: %w(videos tags)
    )
    @page_builder = Jekyll::VideoTags::PageBuilder.new(@site)
  end

  it 'should build out an array of video tags accessible to site config' do
    exp_video_tags = [
      {"title"=>"Collection #1", "slug"=>"collection-01", "url"=>"/media/videos/tags/collection-01"}
    ]
    expect(@site.config['video_tags']).to match_array(exp_video_tags)
  end

  it 'creates a page only for flagged tags found within videos' do
    exp_page_data = ['Collection #1']
    expect(@site.pages.collect { |p| p.data['title'] }).to match_array(exp_page_data)
  end

  it 'runs the paginator' do
    exp_doc_titles = [["Powerhouse Trailer", "What's Crossroads?"]]
    page_doc_titles = @site.pages.collect { |d| d.data['videos']['docs'].collect(&:title) }
    expect(page_doc_titles).to match_array(exp_doc_titles)
  end

end
