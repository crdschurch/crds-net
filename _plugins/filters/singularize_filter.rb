require 'active_support/inflector'

module Jekyll
  module Singularize
    def singularize(str)
      str.singularize
    end
  end
end

Liquid::Template.register_filter(Jekyll::Singularize)
