module Jekyll
  class FeaturesGenerator < Generator

    def generate(site)
      # All docs for the site.
      all_docs = site.collections.values.collect(&:docs).flatten
      # Cycle through each of the features in the sites' features collection.
      site.collections['featured_media'].docs.each do |feature|
        # IDs of the entries attached to the feature in Contentful.
        doc_ids = feature.data['entries'] ? feature.data['entries'].collect { |e| e['id'] } : []
        # Using the IDs, select the doc objects from the site and maintain the
        # sort order of the doc_ids.
        docs = all_docs.select { |d| doc_ids.include?(d.data['id']) }
          .sort_by { |d| doc_ids.index(d.data['id']) }
        # Set the doc objects to the `docs` data attribute for the feature.
        feature.data['docs'] = docs
      end
    end

  end
end
