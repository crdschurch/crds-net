# require_relative '../../lib/utils/html_util'
# require_relative '../../lib/utils/meta_util'
# require 'pry'

#     class MetaGenerator < Jekyll::Generator
#       def generate(site)

#         for page in site.pages
#           title = Utils::HtmlUtil.get_title(page.data.dig('title'), site.config.dig('title'))
#           meta_description = Utils::MetaUtil.get_meta_description(
#             page.data.dig('meta_description'),
#             page.data.dig('description'),
#             site.config.dig('description'))

#           meta_image_url = Utils::MetaUtil.get_meta_image_url(
#             page.data.dig('meta_image'),
#             page.data.dig('image'],
#             page.data.dig('bg_image'],
#             site.config.dig('image'))

#           page_url = Utils::MetaUtil.build_page_url(site.config.dig("url"), site.config.dig("baseurl"), page.data.dig("url"))

#           page['meta_tags'] = [ # construct meta tag content
#             { type: 'name', name: 'title', content: title },
#             { type: 'name', name: 'description', content: description },
#             { type: 'name', name: 'image', content: meta_image_url },
#             { type: 'property', name: 'og:title', content: title },
#             { type: 'property', name: 'og:description', content: meta_description },
#             { type: 'property', name: 'og:image', content: meta_image_url },
#             { type: 'property', name: 'og:url', content: page_url },
#             { type: 'property', name: 'og:site_name', content: site.title }]
#         end

#       end
#     end