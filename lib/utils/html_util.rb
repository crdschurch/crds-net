# traverses the page and site objects to find the most appropriate	
# meta data tags based on a predetermined priority	

module Utils	
  class HtmlUtil	
    # (if the web page title is specified)	
    # Retrieves the web page's title, appending the site title separated by a pipe (e.g. Super Sweet Songs | Crossroads)	

     # (if no web page title is specified)	
    # Returns the site title (e.g. Crossroads)	
    def self.get_title(page_title, site_title)	

       # returns the first image url in the array that has a value	
      if page_title && page_title.to_s.strip.empty? == false && page_title.to_s.strip != site_title.to_s.strip	
        "#{page_title.to_s.strip} | #{site_title.to_s.strip}"	
      else	
        site_title.to_s.strip	
      end	
    end	
  end	
end
