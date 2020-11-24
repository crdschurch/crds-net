module Jekyll
  class OrphansGenerator < Generator

    def generate(site)
      # Ensure messages not associated w/ a series
      # are not included in site build...
      site.collections['messages'].docs.reject!{|doc|
        doc.data.dig('series').blank?
      }
    end

  end
end
