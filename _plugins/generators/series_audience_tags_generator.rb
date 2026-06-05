require 'contentful'

module SeriesAudienceTags
  class Generator < Jekyll::Generator
    priority :highest

    def generate(site)
      series_docs = site.collections.dig('series')&.docs || []
      return if series_docs.empty?

      flag_config = site.config.dig('contentful', 'series', 'metadata_tag_flags') || {}
      return if flag_config.empty?

      tag_ids_by_series_id = fetch_series_tag_ids

      series_docs.each do |series|
        tag_ids = tag_ids_by_series_id[series.data['contentful_id']] || []
        flag_config.each do |field_name, tag_id|
          series.data[field_name] = tag_ids.include?(tag_id)
        end
      end
    end

    private

      def fetch_series_tag_ids(skip = 0, entries = {})
        response = client.entries(
          content_type: 'series',
          limit: PAGE_SIZE,
          skip: skip,
          select: 'sys.id,metadata'
        )

        response.each do |entry|
          entries[entry.id] = metadata_tag_ids(entry)
        end

        response.size == PAGE_SIZE ? fetch_series_tag_ids(skip + PAGE_SIZE, entries) : entries
      end

      def metadata_tag_ids(entry)
        Array(entry._metadata[:tags]).map(&:id)
      end

      def client
        @client ||= ::Contentful::Client.new(
          access_token: ENV['CONTENTFUL_ACCESS_TOKEN'],
          space: ENV['CONTENTFUL_SPACE_ID'],
          environment: ENV['CONTENTFUL_ENV'] || 'master',
          reuse_entries: true
        )
      end

      PAGE_SIZE = 1000
  end
end
