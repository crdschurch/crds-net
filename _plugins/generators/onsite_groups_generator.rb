module Jekyll
  class OnsiteGroupsGenerator < Generator

    def generate(site)
      # Get the meeting group permalinks
      meeting_group_permalinks = Hash.new
      site.
        collections['onsite_groups'].docs.each do |group|
          if !group.data['meetings'].nil?
            group.data['meetings'].each do |meeting|
              meeting_group_permalinks[meeting['id']] = group.url
            end
          end
        end

      # Get all meetings documents from Jekyll collections
      meetings = site.
        collections['onsite_group_meetings'].docs

      # Group meetings by location slug
      meetings_by_location = meetings.
        select{|m| m.data.keys.include?('location') }.
        group_by{|m| m.data['location']['slug'] }

      # Return a few properties for only locations that have meetings
      locations = meetings.
        select{|m| m.data.keys.include?('location') }.
        collect{|m| m.data['location'] }.
        uniq{|l| l['slug'] }.
        collect{|l| l.slice('name', 'slug', 'image','onsite_group_description') }

      # Generate "page" for each location...
      locations.each do |location|
        slug = location['slug']
        # Render the `onsite-group-location.html` template
        page = Jekyll::Page.new(site, '_layouts', '', 'onsite-group-location.html')
        # Tell Jekyll what URL we want for out page
        page.instance_variable_set('@url', "/groups/#{slug}/index.html")
        # Add location and meeting info to page's data object
        page.data['location'] = location
        page.data['meetings'] = meetings_by_location[slug]
        page.data['meeting_group_permalinks'] = meeting_group_permalinks
        # Add the page to Jekyll's pages array
        site.pages << page
      end
    end

  end
end
