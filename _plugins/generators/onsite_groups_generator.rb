require_relative '../../lib/crds/onsite_groups'
require_relative '../../lib/crds/jekyll_pages'

module Jekyll
  class OnsiteGroupsGenerator < Generator

    def generate(site)
      groups = CRDS::OnSiteGroups.new(site)
      pages = CRDS::JekyllPages.new(site)
      groups_by_category = groups.by_category
      categories = site.collections['onsite_group_categories'].docs.select{|c| groups_by_category.keys.include?(c.data.dig('slug')) }

      # Category landings
      groups_by_category.each do |slug, category_groups|
        pages.create!("/groups/#{slug}", 'onsite-groups/index.html', {
          'groups': category_groups.each_slice(2).to_a,
          'category': groups.category_by_slug(slug),
          'categories': categories,
          'slug': slug,
          'path': "/groups/#{slug}"
        })
      end

      # Locations index landings
      groups_by_category.each do |slug, category_groups|
        pages.create!("/groups/locations", 'onsite-groups/location-index.html', {
          'category': groups.category_by_slug(slug),
          'categories': categories,
          'path': "/groups/locations"
        })
      end

      # Location landings
      groups.by_location.each do |slug, meetings|
        slug = slug == 'anywhere' ? 'online' : slug
        pages.create!("/groups/#{slug}", 'onsite-groups/location.html', {
          'location': groups.location_by_slug(slug),
          'meetings': meetings.group_by{|m| m.data['group'].data.dig('category') }.sort_by{|k,v| k['title'] }.reverse
        })
      end

      # Meeting details by location
      gropusAll = groups.all.nil? ? [] : groups.all
      groups.all.each do |group|
        group_slug = group.data.dig('slug')

        meetings = group.data['meetings'].nil? ? [] : group.data['meetings']
        meeting_ids = meetings.collect{|m| m['id'] }.compact
        group_meetings = groups.meetings_by_id(meeting_ids)
        location_slugs = group_meetings.collect{|m|
          groups.location_slugs_for_meeting(m)
        }.flatten

        location_slugs.collect do |location_slug|
          slug = location_slug == 'anywhere' ? 'online' : location_slug
          meetings = group_meetings.select{|m|
            groups.location_slugs_for_meeting(m).include? location_slug
          }
          location = groups.location_by_slug(slug)
          category_slug = group.data["category"]["slug"] ? group.data["category"]["slug"] : "onsite";
          pages.create!("/groups/#{category_slug}/#{group_slug}/#{slug}", 'onsite-groups/detail.html', {
            'group': group,
            'location': location,
            'meetings': meetings
          })
        end
      end
    end

  end
end
