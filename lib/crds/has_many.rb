module CRDS
  class HasMany

    attr_accessor :collections, :site

    def initialize(site)
      @site = site
      @collections = site.config['collections'].select{|k,v| v.keys.include?('has_many') }
    end

    def run!
      @collections.each do |type, cfg|
        @site.collections[type].docs.collect(&parse_doc(cfg))
      end
    end

    def parse_doc(cfg)
      -> (doc) {
        cfg.dig('has_many').each do |name|
          if doc.data[name].present?
            collection_name = doc.collection.label
            doc.data[name].collect(&associate_doc(doc, collection_name))
          end
        end
      }
    end

    def associate_doc(parent, collection_name)
      -> (doc) {
        id = doc.dig('id')

        
        content_type = doc.dig('content_type').pluralize
        if collection = site.collections[content_type]
          child = collection.docs.detect{|e| e.data.dig('id') == id }
          unless child.nil?
            child.data[collection_name] = {
              'id' => parent.data.dig('id'),
              'slug' => parent.data.dig('slug'),
              'title' => parent.data.dig('title')
            } 
          end
        end
      }
    end

  end
end
