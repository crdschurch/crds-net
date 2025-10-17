module MessageVideoFieldGenerator
  class Generator < Jekyll::Generator
    attr_accessor :site
    def generate(site)
      # We are no longer using the bitmovin_url 
      # We will be using source_url moving forward 
      messages = site.collections['messages'].docs

      messages.map do |message|
       if message.data['bitmovin_url'].nil? && message.data['source_url']
          message.data['bitmovin_url'] = message.data['source_url']
        end
      end
    end
  end
end
