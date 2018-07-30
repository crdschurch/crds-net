require_relative './meta_util'
require_relative './html_util'

module Jekyll
  module CRDS

    def get_meta_image(page, page_content, site)
      Jekyll::CRDS::MetaUtil.get_meta_image(
        page['meta_image'],
        page['image'],
        page['bg_image'],
        page_content,
        site['image']
      )
    end


    def get_meta_description(page, site)
      Jekyll::CRDS::MetaUtil.get_meta_description(
        page['meta_description'],
        page['description'],
        site['description']
      )
    end


    def get_meta_title(page, site)
      Jekyll::CRDS::HtmlUtil.get_title(page['title'], site['title'])
    end


    def get_title(page, site)
      Jekyll::CRDS::HtmlUtil.get_title(page['title'], site['title'])
    end
  end
end

Liquid::Template.register_filter(Jekyll::CRDS)