Jekyll::Hooks.register :site, :pre_render do |site|
  require 'open-uri'
  require 'json'

  data_endpoint = "https://#{ENV['CRDS_DATA_ENDPOINT'] || 'crds-data.crossroads.net'}"
  livestream_url = "#{data_endpoint}/livestreams/#{ENV['CRDS_ENV']}.json"

  begin
    response = Net::HTTP.get(URI(livestream_url))
    data = JSON.parse(response)

    site.data['livestreams'] = data['livestreams']
  rescue => e
    Jekyll.logger.warn "Error fetching livestreams data: #{e.message}"
    site.data['livestreams'] = {}
  end
end