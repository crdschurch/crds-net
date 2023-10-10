Jekyll::Hooks.register :site, :pre_render do |site|
  require 'net/http'
  require 'json'

  api_url = "https://graph.instagram.com/me/media?fields=media_type,media_url,thumbnail_url,permalink&access_token=#{ENV['CAMPS_INSTAGRAM_ACCESS_TOKEN']}&limit=10"

  begin
    response = Net::HTTP.get(URI(api_url))
    image_data = JSON.parse(response)

    site.data['camps_ig_images'] = image_data['data'] if image_data && image_data['data']
  rescue StandardError => e
    puts "Error fetching Instagram images: #{e.message}"
    site.data['camps_ig_images'] = []
  end
end