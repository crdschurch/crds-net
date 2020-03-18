require_relative '../../lib/crds/onsite_groups'
require_relative '../../lib/crds/jekyll_pages'

module Jekyll
  class OnsiteGroupsGenerator < Generator

    def generate(site)
      groups = CRDS::OnSiteGroups.new(site)
      pages = CRDS::JekyllPages.new(site)

      # Location landings
      groups.by_location.each do |slug, meetings|
        pages.create!("/groups/onsite/#{slug}", 'onsite-group-location.html', {
          'location': groups.location_by_slug(slug),
          'meetings': meetings
        })
      end

      # Meeting details by location
      groups.all.each do |group|
        group_slug = group.data.dig('slug')

        meeting_ids = group.data['meetings'].collect{|m| m['id'] }.compact
        group_meetings = groups.meetings_by_id(meeting_ids)
        location_slugs = group_meetings.collect{|m| m.data.dig('location','slug') }.compact

        location_slugs.collect do |location_slug|
          meetings = group_meetings.select{|m| m.data.dig('location','slug') == location_slug }
          location = groups.location_by_slug(location_slug)
          # binding.pry

          pages.create!("/groups/onsite/#{group_slug}/#{location_slug}", 'onsite-group-detail.html', {
            'group': group,
            'location': location,
            'meetings': meetings
          })
        end
      end
    end

  end
end
