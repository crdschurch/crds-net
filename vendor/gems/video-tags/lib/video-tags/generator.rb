module Jekyll
  module VideoTags
    class Generator < Jekyll::Generator
      attr_accessor :site

      def generate(site)
        Jekyll::VideoTags::PageBuilder.new(site)
      end

    end
  end
end