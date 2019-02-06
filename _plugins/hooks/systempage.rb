require 'net/http'
require 'pry'

Jekyll::Hooks.register :site, :after_init do |site|
  url = "https://cdn.contentful.com/spaces/#{ENV['CONTENTFUL_SPACE_ID']}/environments/#{ENV['CONTENTFUL_ENV']}/entries?access_token=#{ENV['CONTENTFUL_ACCESS_TOKEN']}&content_type=system_page"
  uri = URI(url)
  response = JSON.parse(Net::HTTP.get(uri))
  
  systemPages = {
    'systemPages' => []
  }
  
  response['items'].each do |item|
    systemPages['systemPages'] << item['fields']
  end
  
  File.open("system-pages.json","w") do |f|
    f.write(systemPages.to_json)
  end
end
