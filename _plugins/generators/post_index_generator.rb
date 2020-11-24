module Jekyll
  class PostIndex < Generator
    safe true
    priority :low
    def generate(site)
      site.collections['articles'].docs.each_with_index do |item, index|
        item.data['index'] = index
      end
    end
  end
end
