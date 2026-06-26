Jekyll::Hooks.register :site, :post_read do |site|
  site.collections.each do |_, collection|
    next unless collection.write?
    collection.docs.each do |doc|
      doc.data['published'] = false if doc.data['exclude_page']
    end
  end
end