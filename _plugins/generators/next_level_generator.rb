module NextLevelGenerator
  class Generator < Jekyll::Generator
    def generate(site)
      site.data['next_level_courses'] = []
      videos = site.collections['videos'].docs
      nextLevelCourses = site.collections['videos'].docs.select{ |doc| doc.data.dig('collections') }
      nextLevelCourses.map do |nextLevelCourse|
        nextLevelCourse.data['collections'] = nextLevelCourse.data['collections'].map do |collection|
          if collection['featured_on_next_level_courses_landing_page'] === true
            id = collection['id']
            site.collections['collections'].docs.detect{ |doc| doc.data.dig('contentful_id') == id}
          end
        end
      end
      if nextLevelCourses.present?
        site.data['next_level_courses'] = nextLevelCourses
      end
    end
  end
end