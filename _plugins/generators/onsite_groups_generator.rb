require_relative '../../lib/crds/onsite_groups'
require_relative '../../lib/crds/jekyll_pages'

module Jekyll
  class OnsiteGroupsGenerator < Generator

    def generate(site)
      groups = CRDS::OnSiteGroups.new(site)
      pages = CRDS::JekyllPages.new(site)

      # Location pages
      groups.by_location.each do |slug, meetings|
        pages.create!("/groups/onsite/#{slug}", 'onsite-group-location.html', {
          'location': groups.location_by_slug(slug),
          'meetings': meetings
        })
      end
    end
  end
end
