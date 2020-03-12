module CRDS
  class OnSiteGroups
    attr_accessor :collections, :site

    def initialize(site)
      @site = site
      @collections = site.collections.select{|k,v| k.include?('onsite_group') }
      @collections['locations'] = site.collections['locations']
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
      @collections['locations'].docs.detect{|l| l.data['slug'] === slug }
    end

    def category_by_slug(slug)
      @collections['onsite_group_categories'].docs.detect{|c| c.data['slug'] === slug }
    end

  end
end