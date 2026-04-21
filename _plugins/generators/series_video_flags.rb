module GetSeriesVideoFlags
  class Generator < Jekyll::Generator
    def generate(site)
      videos = site.collections['videos'].docs
      series_entries = site.collections['series'].docs

      videos.each do |video|
        series_id = video.data.dig('series', 'id')
        next unless series_id.present?

        series = series_entries.detect { |doc| doc.data.dig('contentful_id') == series_id }
        next unless series.present?

        video.data['is_student_ministry_series_video'] = series.data['is_student_ministry_series']
        video.data['is_young_adult_series_video'] = series.data['is_young_adult_series']
      end
    end
  end
end
