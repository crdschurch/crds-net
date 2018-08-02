# traverses the page and site objects to find the most appropriate
# meta data tags based on a predetermined priority

  module Utils
    class MetaUtil
      # Priority:
      # 1) meta image
      # 2) page image
      # 3) page background image
      # 4) page content for 1st image
      # 5) site variable's image
      # Don't love it -- some pretty brittle checks based on the naming conventions of present day
      # method for getting the url for the <meta name="image" content="{{ meta_image }}"> tag in the head of a SSG html page
      def self.get_meta_image_url(page_meta_image, page_image, page_bg_image, page_content, site_image)
        # returns the first image url in the array that has a value
        image_url = [
          page_meta_image,
          page_image,
          page_bg_image,
          search_for_first_image_url_in_page_content(page_content),
          site_image
        ].find{|image_under_review| has_value?(image_under_review)}.to_s.strip
        prepend_url_protocol(image_url)
      end

      # Priority:
      # 1) Page meta description
      # 2) Page description
      # 3) Site description
      # method for getting the text for the <meta name="description" content="{{ meta_description }}"> tag in the head of a SSG html page
      def self.get_meta_description(*meta_description_args)

        # returns the first text in the array that has a value
        meta_description = meta_description_args.find{|description| has_value?(description)}.to_s.strip
        if meta_description && meta_description.length > 155
          meta_description = meta_description[0..155].gsub(/\s\w+\s*$/, '...')
        end

        meta_description
      end

      def self.build_page_url(site_url, page_url)
        "#{site_url}#{page_url.to_s.gsub('index.html', '')}"
      end

      private
        def self.has_value?(to_evaluate) # ensures something of substance exists (nil, whitespace, empty string not welcome)
          to_evaluate && to_evaluate.to_s.strip.empty? == false
        end

        # we really only need to account for the scenario when http or https isn't prepended and should be
        def self.prepend_url_protocol(image_url)
          uri = URI(image_url)
          uri.scheme = uri.host ? 'https' : uri.scheme
          uri.to_s
        end

        #returns the value in the 'src' attribute of the first occurence of an 'img' element
        def self.search_for_first_image_url_in_page_content(page_content)

          if page_content.nil? || page_content.to_s.strip.empty?
            nil
          else
            matches = /<\s*img .*?src=["']?[\s]*([^'">\s]+)/.match(page_content)
            matches.nil? ? nil : matches[1]
          end
        end

    end
  end