module Jekyll
  class CollectedDocumentsGenerator < Generator

    # Ensure that this generator doesn't run before the features_generator, such
    # that all featured_media objects will have Jekyll docs attached to their
    # .docs property.
    priority :low

    def generate(site)
      doc_types = %w[album article episode message video]
      # Find all documents that can be attached to collections and sort them in
      # reverse chronological order.
      collectable_docs = site.documents.select{ |d| doc_types.include?(d.data['content_type']) }
      collectable_docs.sort_by! { |d| d.data['published_at'] }.reverse!
      # Find all featured media docs.
      all_featured_media = site.collections['featured_media'].docs
      # Loop through collections to attach the appropriate docs to each
      # collection.
      site.collections['collections'].docs.each do |collection|
        # The featured object is the featured_media item that has a page_path
        # property that matches the collection's .url property.
        featured_obj = all_featured_media.detect { |m| m['page_path'] == collection.url }
        # Grab up to 7 Jekyll docs from the featured object.
        featured_docs = featured_obj ? featured_obj.data['docs'].first(7) : []
        # And find all other Jekyll docs that are attached to this collection.
        recent_docs = collectable_docs.select do |doc|
          doc.data['collections'].to_a.collect { |c| c['id'] }.include?(collection.data['contentful_id'])
        end
        # Merge featured docs and recent docs into one .docs property for the
        # collection.
        collection.data['docs'] = featured_docs.concat(recent_docs - featured_docs)
      end
    end
  end
end
