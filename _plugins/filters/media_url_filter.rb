module Jekyll
  module MediaURLFilter
    def media_url(url)
      "#{ENV['CRDS_MEDIA_ENDPOINT']}#{url}"
    rescue
      url
    end
  end
end

Liquid::Template.register_filter(Jekyll::MediaURLFilter)
