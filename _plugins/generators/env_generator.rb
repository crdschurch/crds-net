
module Jekyll
  class EnvGenerator < Generator
    attr_accessor :site

    def generate(site)
      @site = site
      @site.config['ENV'] = ENV.to_h
    end

  end
end
