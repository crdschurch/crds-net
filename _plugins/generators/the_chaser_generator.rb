require 'contentful'

module Jekyll
  class TheChaserGenerator < Generator

    def generate(site)
      chaser_id = get_most_recent_discussion.id
      chaser = site.collections['discussions'].docs.detect { |d| d.data['contentful_id'] == chaser_id }
      site.config['chaser'] = chaser
      chaser_msg = site.collections['messages'].docs.detect { |m| m.data['discussion'] == chaser_id }
      site.config['chaser_message'] = chaser_msg
    end

    private

      def client
        @client ||= ::Contentful::Client.new(
          space: ENV['CONTENTFUL_SPACE_ID'],
          access_token: ENV['CONTENTFUL_ACCESS_TOKEN']
        )
      end

      def get_most_recent_discussion
        discussions = client.entries(content_type: 'discussion', order: '-fields.published_at')

        discussions.each do |discussion|
          entries = client.entries(links_to_entry: discussion.id)
          content_type_ids = entries.collect { |e| e.content_type.id }.uniq
          return discussion if entries.count == 0 || content_type_ids.include?('message')
        end
      end

  end
end
