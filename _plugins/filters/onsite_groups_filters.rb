require_relative '../../lib/crds/onsite_groups'

module Jekyll
  module OnsiteGroupsFilters

    def onsite_groups_for_category(category, perSlice = 2)
      groups = site.collections['onsite_groups'].docs.
        select{|g| g.data.keys.include?('category') }.
        select{|g| g.data.dig('category','slug') == category['slug'] }
      groups.each_slice(perSlice).to_a
    end

    def locations_with_onsite_groups(collection)
      locations = utils.location_slugs
      collection.select{|location| locations.include? location.data['slug'] }
    end

    def locations_for_meeting(obj)
      group = obj.instance_variable_get("@obj")
      utils.locations_by_group(group).uniq{|l| l.data.dig('slug')}
    end

    def group_for_meeting(obj)
      meeting = obj.instance_variable_get("@obj")
      utils.group_by_meeting(meeting)
    end

    private

      def utils
        @utils ||= CRDS::OnSiteGroups.new(site)
      end

  end
end

Liquid::Template.register_filter(Jekyll::OnsiteGroupsFilters)