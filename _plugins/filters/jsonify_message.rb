module Jekyll
    module JsonifyMessage
      def jsonify_message(messages, page_date)
        if messages.nil? || page_date.nil?
          return;
        end
        
        message = [
            messages.select{|m| m.date < page_date}.first
        ].map do |m|
            {
                date: m.date,
                content_type: m["content_type"],
                category: m["category"],
                title: m["title"].truncate(55),
                author: m["author"],
                duration: m["duration"],
                background_image: m["background_image"],
                bg_image: m["bg_image"],
                image: m["image"],
                podcast: m["podcast"],
                album: m["album"],
                slug: m["slug"],
                bitmovin_url: m["bitmovin_url"],
                related_videos: m["related_videos"],
                url: m["url"]
            }
        end

        return message.to_json
      end
    end
  end
  
  Liquid::Template.register_filter(Jekyll::JsonifyMessage)