module CRDS
  class OnSiteGroups
    attr_accessor :collections, :site, :known_meeting_ids

    def initialize(site)
      @site = site

      # Loop through all locations and add some new attributes for
      # identifying & displaying these locations later
      site.collections['locations'].docs.each do |location|
         location.data['onsite_group_display_name'] = location.data['name']
         location.data['onsite_group_slug'] = location.data['slug'] != 'anywhere' ? location.data['slug'] : 'online'
      end

      # Returns collections that are relevant to OSG (meetings, groups & categories)
      @collections = site.collections.select{|k,v| k.include?('onsite_group') }

      # Create a reference to location objects so we can do things later
      @collections['locations'] = site.collections['locations']

      # Returns an array of any meeting IDs not returned from known_meeting_ids()
      (
        @collections['onsite_group_meetings']
          .docs
          .reject!{|m| !known_meeting_ids.include?(m['id']) } || []
      )
      .each do |meeting|
        # For each of these meetings...
        # Find group associated with this meeting instance
        group = group_by_meeting(meeting)
        # Set a couple reference variables on the meeting instance
        meeting.data['group_type'] = group.data.dig('category', 'slug')
        meeting.data['group'] = group_by_meeting(meeting)
      end
    end

    ##
    # Return all groups
    # @return Array
    #
    def all
      @all ||= @collections['onsite_groups'].docs
    end

    ##
    # Return slugs for all locations hosting meetings
    # @return Array
    #
    def location_slugs
      @location_slugs ||= by_location.keys
    end

    ##
    # Returns all location slugs for a meeting document
    # @param Jekyll::Document
    # @return Array
    #
    def location_slugs_for_meeting(meeting)
      slugs = (meeting.data.dig('locations') || []).collect{|l| l['slug']}
      slugs << meeting.data.dig('location','slug')
      slugs.compact.uniq
    end

    ##
    # Returns meetings organized by location slug
    #   { "oakley" => [...], ... }
    # @return Array
    #
    def by_location
      @by_location ||= begin
        # For each location...
        Hash[site.collections['locations'].docs.collect{|l|
          # Select meetings whose location or locations[] matches current iteration
          meetings = @collections['onsite_group_meetings'].docs.select do |doc|
            slugs = (doc.data.dig('locations') || []).collect{|l| l.dig('slug') }
            slugs << doc.data.dig('location', 'slug')
            slugs.compact.uniq.include?(l.data['slug'])
          end
          # This syntax returns an object literal...
          #   Hash[ ['key',[...]] ] # => { key: [...] }
          [l.data['slug'], meetings]
        }]
        .reject{|k,v|v.empty?} # Do not return locations with 0 meetings
      end
    end

    ##
    # Returns groups organized by category slug
    #   { "site-based" => [...], ... }
    # @return Array
    #
    def by_category
      @by_category ||= begin
        @collections['onsite_groups'].docs.
        group_by{|g| g.data.dig('category', 'slug') }
      end
    end

    ##
    # Lookup location by it's slug value
    # @param String
    # @return Jekyll::Document
    #
    def location_by_slug(slug)
      @collections['locations'].docs.detect{|l| l.data['onsite_group_slug'] === slug }
    end

    ##
    # Lookup category by it's slug value
    # @param String
    # @return Jekyll::Document
    #
    def category_by_slug(slug)
      @collections['onsite_group_categories'].docs.detect{|c| c.data['slug'] === slug }
    end

    ##
    # Returns a unique array of meeting documents included in meeting_ids arg
    # @param Array
    # @return Array
    #
    def meetings_by_id(meeting_ids)
      @collections['onsite_group_meetings'].
        docs.
        select{|m| meeting_ids.include?(m['id']) }.
        compact.
        uniq
    end

    ##
    # Returns a unique array of all locations where a group's meetings are hosted
    # @param Jekyll::Document
    # @return Array
    #
    def locations_by_group(group)

      # Get ids for all of this group's meetings
      ids = (
          group.data.dig('meetings').nil? ? [] : group.data.dig('meetings')
        )
        .collect{|m| m['id'] }
        .compact

      # Reference for all the meeting objects
      meetings = meetings_by_id(ids)
      # Reference for all location objects
      locations = @site.collections['locations'].docs

      # For every meeting return it's locations
      group_locations = meetings.collect do |m|
          slugs = (m.data.dig('locations') || []).collect{|l| l['slug'] } || []
          slugs << m.data.dig('location','slug')
          slugs = slugs.compact.uniq

          locations.select{|l| slugs.include?(l.data.dig('slug')) }
        end

      # binding.pry if group.data['id'] == '6d1GWqGbUix35uYdELO2gP'
      group_locations.
        collect do |ls|
          ls.compact.uniq
        end
        .flatten
        .sort{|a,b| a.data['name'] <=> b.data['name'] } # Sort alphabetically
    end

    ##
    # Returns the group associated with a meeting
    # @param Jekyll::Document
    # @return Jekyll::Document
    #
    def group_by_meeting(meeting)
      meeting_id = meeting.data.dig('id')
      @collections['onsite_groups'].docs.detect do |group|
        (group.data.dig('meetings') || []).collect{|m| m.dig('id') }.include?(meeting_id)
      end
    end

    private

      ##
      # Returns an array containing every meeting id across all groups
      # @return Array
      #
      def known_meeting_ids
        @known_meeting_ids ||= begin
          @collections['onsite_groups'].docs.flat_map do |g|
            meetings = g.data.dig('meetings').nil? ? [] : g.data.dig('meetings')
            meetings.collect{|m| m['id'] }
          end.flatten.compact
        end
      end

  end
end