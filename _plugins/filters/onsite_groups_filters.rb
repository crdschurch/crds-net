module Jekyll
  module OnsiteGroupsFilters

    def onsite_groups_for_category(category)
      groups = site.collections['onsite_groups'].docs.select{|g| g['category'].try('slug') == category['slug'] }
      groups.each_slice(2).to_a
    end

    def locations_with_onsite_groups(collection)
      locations = site.collections['onsite_group_meetings'].docs.collect{|m| m['location'].try('slug') }.compact.uniq
      collection.select{|location| locations.include? location.data['slug'] }
    end

  end
end

Liquid::Template.register_filter(Jekyll::OnsiteGroupsFilters)