module ShowsGenerator
  class Generator < Jekyll::Generator
    def generate(site)
      site.data['shows'] = []
      videos = site.collections['videos'].docs
      shows = site.collections['videos'].docs.select{ |doc| doc.data.dig('collections') }
      shows.map do |show|
        
        show.data['collections'] = show.data['collections'].map do |collection|
          id = collection['id']
          site.collections['collections'].docs.detect{ |doc| doc.data.dig('contentful_id') == id}
        end
      end
      if shows.present?
        site.data['shows'] = shows
      end
    end
  end
end