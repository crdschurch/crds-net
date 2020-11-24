require 'fileutils'

module Jekyll
  module VideoTags
    class PageBuilder

      attr_reader :site, :tag_names, :featureable_tags

      def initialize(site)
        @site = site
        init_tags
        generate_pages
      end

      private

        def init_tags
          begin
            # Gather an array of tag names from the video collection docs.
            videos = site.collections['videos'].docs
            video_tag_names = videos.collect { |d| d.data['tags'].collect { |t| t['title'] } }.flatten.uniq.sort

            # Filter out only those tags that can act as video collections.
            @featureable_tags = @site.collections['tags'].docs.select { |t|
              video_tag_names.include?(t.data['title']) && t.data['video_collection']
            }
            @tag_names = featureable_tags.collect { |t| t.data['title'] }

            # Inject video_tags into the site's config so they can be iterated
            # upon. Specifically, this enables us to build the video nav without
            # extra effort.
            site.config['video_tags'] = []
            featureable_tags.each do |tag|
              site.config['video_tags'] << {
                'title' => tag.data['title'],
                'slug' => tag.data['slug'],
                'url' => "/videos/tags/#{tag.data['slug']}"
              }
            end
          rescue NoMethodError
            @tag_names = []
            site.config['video_tags'] = []
          end
        end

        def generate_pages
          # For each video tag, build out a corresponding page using the video_tag
          # layout.
          featureable_tags.each do |tag|
            page = Jekyll::Page.new(site, site.source, '_layouts', 'video_tag.html')
            # Customize the URL for the new page.
            page.instance_variable_set('@url', "/videos/tags/#{tag.data['slug']}/index.html")
            # Add default frontmatter to the new page.
            (page.data ||= {}).merge!(
              'layout' => 'default',
              'slug' => tag.data['slug'],
              'title' => tag.data['title']
            )
            # Inject the page into the site's pages.
            site.pages << page

            # Run the paginator.
            ::PagingMisterHyde::Paginator.new(site, page)
          end
        end

    end
  end
end
