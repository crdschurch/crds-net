require 'pry'

Jekyll::Hooks.register :documents, :pre_render do |doc|

  if doc.collection.label == 'pages'
    doc.data['sitemap'] = !doc.data['search_excluded']
  end
  
end
