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
    # Returns meetings organized by location slug
    #   { "oakley" => [...], ... }
    # @return Array
    #
    def by_location
      @by_location ||= begin
        @collections['onsite_group_meetings'].docs.
          # TODO
          select{|m| m.data.keys.include?('location') && m.data['location'].present? }.
          group_by{|m| m.data.dig('location','slug') }
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

      # For every meeting
      meetings.collect do |m|
          # ...return it's location
          # TODO
          slug = m.data.dig('location','slug')
          locations.detect{|l| l.data.dig('slug') == slug }
        end.
        compact.
        # No dupes
        uniq{|m| m.data['id'] }.
        # Sort the return value alphabetically
        sort{|a,b| a.data['name'] <=> b.data['name'] }
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