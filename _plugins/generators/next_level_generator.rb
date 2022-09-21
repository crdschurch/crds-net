module NextLevelGenerator
  class Generator < Jekyll::Generator
    def generate(site)
      site.data['next_level_courses'] = []
      next_level_collections = site.collections['collections'].docs.select{ |c| c.data.dig('featured_on_next_level_courses_landing_page').present?}
      courses = next_level_collections.map do |collection|  
        collection.data['collections'].map do |video|
          if video['content_type'] == 'video'
            id = video['id']
            site.collections['videos'].docs.detect{ |doc| doc.data.dig('contentful_id') == id}
          end
        end
      end

      if courses.present?
        site.data['next_level_courses'] = courses.flatten.compact
      end
    end
  end
end
