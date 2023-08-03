# module ImgixGenerator
#   class Generator < Jekyll::Generator
#     def generate(site)
#       collections_to_process = ['articles', 'series', 'pages', 'messages', 'episodes', 'podcasts', 'locations']

#       collections_to_process.each do |collection_name|
#         site.collections[collection_name].docs.each do |item|
#           process_content(item)
#         end
#       end
#     end

#     def process_content(content)
#       # Regular expression to find image URLs with 'images.ctfassets.net' domain
#       regex = /https:\/\/images.ctfassets.net\/y3a9myzsdjan\/[\w\/\-_.]+.(png|jpg|jpeg)/

#       # Loop through the content and replace the URLs with Imgix URLs
#       content.content.gsub!(regex) do |url|
#         replace_with_imgix(url)
#       end
#     end

#     def replace_with_imgix(url)
#       if url.include?('images.ctfassets.net') && !url.include?('.gif') && !url.include?('.svg')
#         imgix_params = {}

#         imgix_url = url
#           .sub('images.ctfassets.net/y3a9myzsdjan', 'crds-media.imgix.net')
#           .concat('?auto=format,compress')

#         # Append Imgix parameters to the URL
#         imgix_params.each do |key, value|
#           imgix_url.concat("&#{key}=#{value}")
#         end

#         imgix_url
#       else
#         url
#       end
#     end
#   end
# end
