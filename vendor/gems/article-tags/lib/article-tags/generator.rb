module Jekyll
  module ArticleTags
    class Generator < Jekyll::Generator
      attr_accessor :site

      def generate(site)
        Jekyll::ArticleTags::PageBuilder.new(site)
      end

    end
  end
end
