module GetIsStudentMinistrySeriesVideo
  class Generator < Jekyll::Generator
    def generate(site)
      videos = site.collections['videos'].docs

      videos.each do |video|
        if video.data.dig('series', 'id').present?
          id = video.data.dig('series', 'id')
          series = site.collections['series'].docs.detect{ |doc| doc.data.dig('contentful_id') == id}
          if series.present?
            video.data['is_student_ministry_series_video'] = (series.data['is_student_ministry_series'])
          end
        end
      end
    end
  end
end