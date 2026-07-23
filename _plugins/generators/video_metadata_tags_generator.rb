require 'contentful'

module VideoMetadataTags
  class Generator < Jekyll::Generator
    priority :highest

    def generate(site)
      video_docs = site.collections.dig('videos')&.docs || []
      return if video_docs.empty?

      kids_club_tag_ids =
        Array(site.config.dig('contentful', 'video', 'kids_club_metadata_tag_ids'))
      return if kids_club_tag_ids.empty?

      tag_ids_by_video_id = fetch_video_tag_ids

      video_docs.each do |video|
        tag_ids = tag_ids_by_video_id[video.data['contentful_id']] || []
        video.data['media_video_index_visibility_derived'] =
          (tag_ids & kids_club_tag_ids).any? ? 'excluded' : 'included'
      end
    end

    private

      def fetch_video_tag_ids(skip = 0, entries = {})
        response = client.entries(
          content_type: 'video',
          limit: PAGE_SIZE,
          skip: skip,
          select: 'sys.id,metadata'
        )

        response.each do |entry|
          entries[entry.id] = metadata_tag_ids(entry)
        end

        response.size == PAGE_SIZE ? fetch_video_tag_ids(skip + PAGE_SIZE, entries) : entries
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
