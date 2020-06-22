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
    expect(@groups.by_location.keys).to include(*%w(oakley mason))
    expect(@groups.by_location.keys).to_not include(nil)
    expect(@groups.by_location['oakley']).to be_a(Array)
  end

  it 'should return meetings grouped by category' do
    expect(@groups.by_category.keys).to include(*%w(onsite-groups))
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

  it 'should return meetings by an array of ids' do
    ids = %w(2fis1qVWaqR4Pow8UWMilD 1xJH47b9VtMEHlN961zzTn)
    meetings = @groups.meetings_by_id(ids)
    expect(meetings.first.content_type).to eq('onsite_group_meeting')
    expect(meetings.collect{|m| m['id']}).to match_array(ids)
  end

  it 'should return locations for a group' do
    group = @site.collections['onsite_groups'].docs.first
    locations = @groups.locations_by_group(group)
    expect(locations.first.content_type).to eq('location')
  end

  it 'should return group for a meeting' do
    meeting = @site.collections['onsite_group_meetings'].docs.first
    group = @groups.group_by_meeting(meeting)
    expect(group.data['id']).to eq('7deAOj56E3OHEmL0yQtCG7')
  end

  it 'should not return meetings that have no group association' do
    total = @site.collections['onsite_group_meetings'].count
    expect(@groups.send(:known_meeting_ids).count).to be(total)
  end

end