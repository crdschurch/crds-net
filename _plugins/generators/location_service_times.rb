module LocationServiceTimes
  class Generator < Jekyll::Generator
    def generate(site)
      locations = site.collections['locations'].docs
      locations.each do |location|
        next if location.data['reference_service_times'].nil? || !location.data['reference_service_times'].is_a?(Array)
        
        full_reference_service_times = []
        
        location.data['reference_service_times'].each do |service_time_entry|
          service_time_id = service_time_entry['id']
          service_time_doc = site.collections['serviceTimes'].docs.detect do |doc|
            doc.data.dig('contentful_id') == service_time_id
          end
          
          full_reference_service_times << service_time_doc.data if service_time_doc
        end
        
        location.data['reference_service_times'] = full_reference_service_times unless full_reference_service_times.empty?
      end
    end
  end
end
