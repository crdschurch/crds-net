require_relative '../../lib/utils/meta_util'
require_relative '../../lib/utils/html_util'
require 'pry'

module CRDS
  module Filters
    module HtmlAndMetaUtilFilter

      def get_meta_image(page, site)
        ::Utils::MetaUtil.get_meta_image_url(
          page['meta_image'].nil? ? nil : page['meta_image']['url'],
          page['image'].nil? ? nil : page['image']['url'],
          page['bg_image'].nil? ? nil : page['bg_image']['url'],
          page['description'],
          site['image']
        )
      end

      def get_meta_description(page, site)
        ::Utils::MetaUtil.get_meta_description(
          page['meta_description'],
          page['excerpt'],
          site['description']
        )
      end

      def build_page_url(page, site)
        ::Utils::MetaUtil.build_page_url(site["url"], page["url"])
      end

      def get_meta_title(page, site)
        ::Utils::HtmlUtil.get_title(page['title'], site['title'])
      end

      def get_title(page, site)
        ::Utils::HtmlUtil.get_title(page['title'], site['title'])
      end

    end
  end
end

Liquid::Template.register_filter(CRDS::Filters::HtmlAndMetaUtilFilter)