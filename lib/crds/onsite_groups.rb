module CRDS
  class OnSiteGroups
    attr_accessor :collections, :site, :known_meeting_ids

    def initialize(site)
      @site = site
      site.collections['locations'].docs.each do |location|
         location.data['onsite_group_display_name'] = location.data['name']
         location.data['onsite_group_slug'] = location.data['slug'] != 'anywhere' ? location.data['slug'] : 'online'
      end
      @collections = site.collections.select{|k,v| k.include?('onsite_group') }
      @collections['locations'] = site.collections['locations']
      (@collections['onsite_group_meetings'].docs.reject!{|m| !known_meeting_ids.include?(m['id']) } || [])
        .each do |meeting|
          group = group_by_meeting(meeting)
          meeting.data['group_type'] = group.data.dig('category', 'slug')
          meeting.data['group'] = group_by_meeting(meeting)
      end
    end

    def all
      @all ||= @collections['onsite_groups'].docs
    end

    def by_location
      @by_location ||= begin
        @collections['onsite_group_meetings'].docs.
          select{|m| m.data.keys.include?('location') && m.data['location'].present? }.
          group_by{|m| m.data.dig('location','slug') }
      end
    end

    def by_category
      @by_category ||= begin
        @collections['onsite_groups'].docs.
        group_by{|g| g.data.dig('category', 'slug') }
      end
    end

    def location_by_slug(slug)
      @collections['locations'].docs.detect{|l| l.data['onsite_group_slug'] === slug }
    end

    def category_by_slug(slug)
      @collections['onsite_group_categories'].docs.detect{|c| c.data['slug'] === slug }
    end

    def meetings_by_id(meeting_ids)
      @collections['onsite_group_meetings'].
        docs.
        select{|m| meeting_ids.include?(m['id']) }.
        compact.
        uniq
    end

    def locations_by_group(group)
      mettings = group.data.dig('meetings').nil? ? [] : group.data.dig('meetings')
      ids = mettings.collect{|m| m['id'] }.compact
      meetings = meetings_by_id(ids)
      locations = @site.collections['locations'].docs

      meetings.collect do |m|
          slug = m.data.dig('location','slug')
          locations.detect{|l| l.data.dig('slug') == slug }
        end.
        compact.
        uniq{|m| m.data['id'] }.
        sort{|a,b| a.data['name'] <=> b.data['name'] }
    end

    def group_by_meeting(meeting)
      meeting_id = meeting.data.dig('id')
      @collections['onsite_groups'].docs.detect do |group|
        (group.data.dig('meetings') || []).collect{|m| m.dig('id') }.include?(meeting_id)
      end
    end

    private

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