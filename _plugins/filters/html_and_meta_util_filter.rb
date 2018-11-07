require_relative '../../lib/utils/meta_util'
require_relative '../../lib/utils/html_util'

module CRDS
  module Filters
    module HtmlAndMetaUtilFilter

      # Priority:
      # 1) page meta image
      # 2) page image
      # 3) page background image
      # 4) page content for 1st image
      # 5) site variable's image
      # method for getting the url for the <meta name="image" content="{{ meta_image }}"> tag in the head of a SSG html page
      def get_meta_image(page, site)
        ::Utils::MetaUtil.get_meta_image_url(
          page['meta'].nil? ? nil : page['meta']['image']['url'],
          page['meta_image'].nil? ? nil : page['meta_image']['url'],
          page['image'].nil? ? nil : page['image']['url'],
          page['bg_image'].nil? ? nil : page['bg_image']['url'],
          page['description'].nil? ? page['body'] : page['description'],
          site['image']
        )
      end

      # Priority:
      # 1) Page meta object description (Meta content model)
      # 2) Page meta description (Page content model)
      # 3) Page description
      # 4) Site description
      # method for getting the text for the <meta name="description" content="{{ meta_description }}"> tag in the head of a SSG html page
      def get_meta_description(page, site)
        ::Utils::MetaUtil.get_first_item_with_value(
          page['meta'].nil? ? nil : page['meta']['description'],
          page['meta_description'],
          page['excerpt'],
          page['description'],
          page['body'],
          site['description']
        )
      end

      # Priority:
      # 1) page meta object title (Meta content model)
      # 2) page title (Page content model)
      # 3) site title
      # method for getting the text for the <meta name="title" content="{{ meta_title }}"> tag in the head of a SSG html page
      def get_meta_title(page, site)
        ::Utils::MetaUtil.get_first_item_with_value(
          page['meta'].nil? ? nil : page['meta']['title'],
          page['title'],
          site['title']
        )
      end

      def build_page_url(page, site)
        ::Utils::MetaUtil.build_page_url(site["url"], page["url"])
      end

      def get_title(page, site)
        ::Utils::HtmlUtil.get_title(page['title'], site['title'])
      end

    end
  end
end

Liquid::Template.register_filter(CRDS::Filters::HtmlAndMetaUtilFilter)