require 'contentful'
require 'date'

module UpcomingHappenings
  class Generator < Jekyll::Generator
    priority :highest

    def generate(site)
      configurations = site.data['upcoming_happenings'] || {}

      configurations.each_value do |configuration|
        configuration['promos'] = fetch_promos(configuration['tags'])
      end
    end

    private

      def fetch_promos(tags, skip = 0, promos = [])
        tag_ids = Array(tags).compact
        return promos if tag_ids.empty?

        response = client.entries(
          content_type: 'promo',
          limit: PAGE_SIZE,
          skip: skip,
          order: '-fields.published_at',
          'metadata.tags.sys.id[in]' => tag_ids.join(',')
        )

        serialized_promos = response
          .select { |promo| eligible?(promo) }
          .map(&method(:serialize))
          .compact

        promos.concat(serialized_promos)

        if response.size == PAGE_SIZE
          fetch_promos(tag_ids, skip + PAGE_SIZE, promos)
        else
          promos
        end
      end

      def serialize(promo)
        image = promo.fields[:image]
        image_file = image&.fields&.dig(:file)
        title = promo.fields[:title]

        return if title.to_s.strip.empty? || !image_file

        {
          'id' => promo.id,
          'title' => title,
          'published_at' => promo.fields[:published_at],
          'description' => promo.fields[:description],
          'link_url' => promo.fields[:link_url],
          'featured_cta' => promo.fields[:featured_cta],
          'event_start_date' => promo.fields[:event_start_date],
          'event_end_date' => promo.fields[:event_end_date],
          'sign_up_date' => promo.fields[:sign_up_date],
          'display_date' => display_date(promo),
          'location' => promo.fields[:location],
          'map_url_link' => promo.fields[:map_url_link],
          'image' => {
            'url' => image_file.url,
            'alt' => image.fields[:title].to_s.strip.empty? ? title : image.fields[:title]
          }
        }
      end

      def eligible?(promo)
        published_at = parse_date(promo.fields[:published_at])
        unpublished_at = parse_date(promo.fields[:unpublished_at])
        today = Date.today

        !promo.fields[:app_only] &&
          (!published_at || published_at <= today) &&
          (!unpublished_at || today <= unpublished_at)
      end

      def display_date(promo)
        start_date = parse_date(promo.fields[:event_start_date])
        end_date = parse_date(promo.fields[:event_end_date])
        sign_up_date = parse_date(promo.fields[:sign_up_date])

        if start_date && end_date
          format_date_range(start_date, end_date)
        elsif start_date || sign_up_date
          format_full_date(start_date || sign_up_date)
        end
      end

      def format_date_range(start_date, end_date)
        if start_date.year == end_date.year && start_date.month == end_date.month
          "#{start_date.strftime('%B')} #{start_date.day}-#{end_date.day}, #{start_date.year}"
        elsif start_date.year == end_date.year
          "#{format_short_date(start_date)} - #{format_short_date(end_date)}, #{start_date.year}"
        else
          "#{format_short_date(start_date)}, #{start_date.year} - #{format_short_date(end_date)}, #{end_date.year}"
        end
      end

      def format_full_date(date)
        "#{date.strftime('%B')} #{date.day}, #{date.year}"
      end

      def format_short_date(date)
        "#{date.strftime('%b')} #{date.day}"
      end

      def parse_date(value)
        Date.parse(value.to_s) if value
      rescue ArgumentError
        nil
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
