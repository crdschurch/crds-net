module LocationServiceTimes
  class Generator < Jekyll::Generator
    def generate(site)
      locations = site.collections['locations'].docs
      locations.each do |location|
        next if location.data['service_times'].nil? || !location.data['service_times'].is_a?(Array)
        
        full_service_times = []
        
        location.data['service_times'].each do |service_time_entry|
          service_time_id = service_time_entry['id']
          service_time_doc = site.collections['serviceTimes'].docs.detect do |doc|
            doc.data.dig('contentful_id') == service_time_id
          end
          
          full_service_times << service_time_doc.data if service_time_doc
        end
        
        location.data['service_times'] = full_service_times unless full_service_times.empty?
        # binding.pry
      end
    end
  end
end
