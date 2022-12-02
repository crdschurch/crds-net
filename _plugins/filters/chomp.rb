module Jekyll
  module ChompFilter
    def chomp(str, chomp_str)
      str.chomp(chomp_str)
    end
  end
end

Liquid::Template.register_filter(Jekyll::ChompFilter)