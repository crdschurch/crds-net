module CRDS
  class JekyllPages
    attr_accessor :site

    def initialize(site)
      @site = site
    end

    def create!(path, layout, data={})
      page = Jekyll::Page.new(@site, '_layouts', '', layout)
      path = "#{path}/index.html" unless path.end_with?('/index.html')
      page.instance_variable_set('@url', path)
      data.each do |k,v|
        page.data[k.to_s] = v
      end
      @site.pages << page
    end
  end
end