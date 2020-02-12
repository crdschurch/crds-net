require 'active_support/core_ext/array/grouping'

module Jekyll
  module InGroupsOf
    def in_groups(array, group_count)
      return array.in_groups_of(group_count, false) unless array.nil?
    end
  end
end

Liquid::Template.register_filter(Jekyll::InGroupsOf)