module Jekyll
  class SpanishFilter < Generator

    def generate(site)
      # Remove messages and series which are marked as spanish
      site.collections['messages'].docs.reject!{|doc|
        doc.data.dig('is_spanish') == true
      }
      
      site.collections['series'].docs.reject!{|doc|
        doc.data.dig('is_spanish') == true
      }
    end

  end
end