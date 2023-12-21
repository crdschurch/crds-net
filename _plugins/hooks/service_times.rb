Jekyll::Hooks.register :site, :pre_render do |site|
  require 'open-uri'
  require 'json'

  data_endpoint = "https://#{ENV['CRDS_DATA_ENDPOINT'] || "crds-data.crossroads.net"}"
  service_times_url = "#{data_endpoint}/service-times/service-times.json"

  begin
    response = Net::HTTP.get(URI(service_times_url))
    data = JSON.parse(response)
    
    site.data['service_times'] = data['serviceTimes'][0]
  rescue
    site.data['service_times'] = {}
  end
end
