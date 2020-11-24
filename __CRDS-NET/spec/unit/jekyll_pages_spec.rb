require 'spec_helper'

describe CRDS::JekyllPages do

  before do
    @site = JekyllHelper.scaffold(
      collections_dir: File.expand_path('../fixtures/collections', __dir__),
      collections: %w(locations onsite_groups onsite_group_categories onsite_group_meetings)
    )
    @pages = CRDS::JekyllPages.new(@site)
  end

  it 'should create new pages' do
    slug = '/this-is-a-test-of-jekyll-pages'
    @pages.create!(slug, 'default.html')
    expect(@site.pages.collect(&:url)).to include("#{slug}/index.html")
  end

end