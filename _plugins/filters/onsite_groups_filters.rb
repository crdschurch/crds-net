module Jekyll
  module OnsiteGroupsFilters

    def onsite_groups_for_category(category)
      groups = site.collections['onsite_groups'].docs.select{|g| g['category']['slug'] == category['slug'] }
      groups.each_slice(2).to_a
    end

  end
end

Liquid::Template.register_filter(Jekyll::OnsiteGroupsFilters)