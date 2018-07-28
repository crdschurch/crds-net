# traverses the page and site objects to find the most appropriate
# meta data tags based on a predetermined priority

module Jekyll
  module CRDS
    class MetaUtil
      # Priority:
      # 1) if the meta image exists, use it
      # 2) page image
      # 3) page background image
      # 4) first image found in page content
      # 5) site variable's image
      # Don't love it -- some pretty brittle checks based on naming conventions established in media
      # method for getting the url for the <meta name="image" content="{{ meta_image }}"> tag in the head of a SSG html page
      def self.get_meta_image(page_meta_image, page_image, page_bg_image, page_content, site_image)

        # returns the first image url in the array that has a value
        image_url = [
          page_meta_image,
          page_image,
          page_bg_image,
          search_for_image_in_page_content(page_content), #invoking the regex this way returns the FIRST match
          site_image
        ].find{|image_under_review| has_value?(image_under_review)}.to_s.strip


        image_url = prepend_url_protocol(image_url)
        # Explanation of "find" method: .find(|meta_data| meta_data) where the first one is the value being considered
        # and the second mention represents the truthy/falsy "exists?" criteria for whether we use that particular
        # instance in the enumerable or skip to the next value
      end

      # Priority:
      # 1) Page meta description
      # 2) Site description
      # method for getting the text for the <meta name="description" content="{{ meta_description }}"> tag in the head of a SSG html page
      def self.get_meta_description(page_meta_description, site_description)

        # returns the first text in the array that has a value
        [
          page_meta_description,
          site_description
        ].find{|description_under_review| has_value?(description_under_review)}.to_s.strip

        # for now, we'll truncate in the markup
        # if meta_description && meta_description.length > 155
        #   meta_description = meta_description[0..155].gsub(/\s\w+\s*$/, '...')
        # end

        # meta_description
      end

      private
        def self.has_value?(to_evaluate)
          to_evaluate && to_evaluate.to_s.strip.empty? == false
        end

        # we really only need to account for the scenario when http or https isn't prepended
        def self.prepend_url_protocol(image_url)
          url_doesnt_start_with_a_protocol = image_url[/^http[s]?:/].nil?       # asks: does the string start with http: or https:
          url_doesnt_start_with_an_authority_prefix = image_url[/^\/{2}/].nil?  # asks: does the string start with exactly 2 forward slashes: //
  
          url_protocol = nil;
          if url_doesnt_start_with_a_protocol && url_doesnt_start_with_an_authority_prefix == false
            url_protocol = 'https:'
          end

          "#{url_protocol}#{image_url}"
        end

        #returns the value in the 'src' attribute of the first occurence of an 'img' element
        def self.search_for_image_in_page_content(page_content)

          if page_content.nil? || page_content.to_s.strip.empty?
            nil
          else
            matches = /<\s*img .*?src=["']?[\s]*([^'">\s]+)/.match(page_content)
            matches.nil? ? nil : matches[1]
          end
        end

    end
  end
end