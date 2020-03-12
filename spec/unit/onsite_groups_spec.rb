require 'spec_helper'

describe CRDS::OnSiteGroups do

  before do
    @site = JekyllHelper.scaffold(
      collections_dir: File.expand_path('../fixtures/collections', __dir__),
      collections: %w(locations onsite_groups onsite_group_categories onsite_group_meetings)
    )
    @groups = CRDS::OnSiteGroups.new(@site)
  end

  it 'should return meetings grouped by location' do
    expect(@groups.by_location.keys).to include(*%w(oakley lexington mason))
    expect(@groups.by_location.keys).to_not include(nil)
    expect(@groups.by_location['oakley']).to be_a(Array)
  end

  it 'should return meetings grouped by category' do
    expect(@groups.by_category.keys).to include(*%w(onsite-groups onsite-healing-groups))
  end

  it 'should return location by slug' do
    slug = 'oakley'
    location = @site.collections['locations'].docs.detect{|l| l.data['slug'] === slug }
    expect(@groups.location_by_slug(slug)).to eq(location)
  end

  it 'should return category by slug' do
    slug = 'onsite-groups'
    category = @site.collections['onsite_group_categories'].docs.detect{|c| c.data['slug'] === slug }
    expect(@groups.category_by_slug(slug)).to eq(category)
  end

end