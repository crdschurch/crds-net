module Jekyll
  module OnsiteGroupsFilters

    def onsite_groups_for_category(category, perSlice = 2)
      groups = site.collections['onsite_groups'].docs.
        select{|g| g.data.keys.include?('category') }.
        select{|g| g['category']['slug'] == category['slug'] }
      groups.each_slice(perSlice).to_a
    end

    def locations_with_onsite_groups(collection)
      locations = site.collections['onsite_group_meetings'].docs.
        select{|g| g.data.keys.include?('location') }.
        collect{|m| m['location']['slug'] }.compact.uniq

      collection.select{|location| locations.include? location.data['slug'] }
    end

  end
end

Liquid::Template.register_filter(Jekyll::OnsiteGroupsFilters)
