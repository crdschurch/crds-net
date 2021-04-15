require 'paging-mister-hyde'

module Jekyll
  class MediaTagsGenerator < Jekyll::Generator

    attr_reader :site

    def generate(site)
      @site = site
      generate_pages
    end

    private

      def generate_pages
        site.collections['tags'].docs.each do |tag|
          # Create a new page with the tag layout.
          page = Jekyll::Page.new(site, site.source, '_layouts', 'tag.html')
          # Customize the URL for the page.
          page.instance_variable_set('@url', "/media/tags/#{tag.data['slug']}/index.html")
          # Add default frontmatter to the page.
          (page.data ||= {}).merge!(
            'slug' => tag.data['slug'],
            'title' => tag.data['title'],
          )
          # Inject the page into the site's pages.
          site.pages << page
          # Run the paginator.
          ::PagingMisterHyde::Paginator.new(site, page)
        end
      end

  end
end
