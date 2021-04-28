module Jekyll
  class SubtopicsGenerator < Jekyll::Generator

    def generate(site)
      # Global references to docs within Jekyll.
      all_docs = site.collections.values.collect(&:docs).flatten
      all_tags = site.collections['tags'].docs
      all_topics = site.collections['categories'].docs
      # Loop through each topic doc.
      all_topics.each do |topic|
        # Get all docs that have applied this topic.
        topic_docs = all_docs.select { |d| d.data['category'].is_a?(Hash) && d.data.dig('category', 'id') == topic.data['contentful_id'] }
        # Create a reference to publishable docs within this topic. Docs that
        # have a `published_at` field are considered publishable.
        topic_media = topic_docs.select { |d| d.data['published_at'] }
        # Publishable docs should be sorted in reverse chronological order.
        topic_media.sort_by! { |d| d.data['published_at'] }.reverse!
        # Set the featured_media on the topic to the most recent three
        # publishable docs.
        topic.data['featured_media'] = topic_media.first(3)
        # Look through all the topic's associated docs to find all tags used
        # within this topic.
        tag_ids = topic_docs.collect do |d|
          return [] unless d.data['tags'].is_a?(Array)
          d.data['tags'].collect { |t| t['id'] }
        end
        tag_ids = tag_ids.flatten.uniq
        # Use the topic's tag names to collect the Jekyll docs representing the
        # associated tags.
        topic_tags = all_tags.select { |t| tag_ids.include?(t.data['contentful_id']) }
        # Sort tags by (case-insensitive) title.
        topic_tags.sort_by! { |t| t.data['title'].downcase }
        # Convert associated tags to be `featured_tags`. Although they are
        # featured tags, they come through as `tags` based on the field name in
        # Contentful.
        topic.data['featured_tags'] = topic.data['tags'] || []
        # Featured tags are found using the featured_tags array to extract
        # featured from the topic_tags array. Thus, if a tag is set in
        # Contentful that doesn't belong in this topic, it is ignored.
        featured_tag_ids = topic.data['featured_tags'].collect { |t| t['id'] }
        featured_tags = topic_tags.select { |t| featured_tag_ids.include?(t.data['contentful_id']) }
        # Featured tags are sorted by the order from which they came in from
        # Contentful.
        featured_tags.sort_by! { |t| featured_tag_ids.index(t.data['contentful_id']) }
        # Set the topic's featured_tag_data by looping through the featured_tags
        # array and storing a reference to the tag and to the media which has
        # applied the tag and this topic.
        topic.data['featured_tag_data'] = featured_tags.map do |tag|
          media = topic_media.select do |d|
            return [] unless d.data['tags'].is_a?(Array)
            d.data['tags'].collect { |t| t['id'] }.include?(tag.data['contentful_id'])
          end
          { 'tag' => tag, 'media' => media }
        end
        # Set `tags` to be all associated tags used within the topic.
        topic.data['tags'] = topic_tags
      end
    end

  end
end
