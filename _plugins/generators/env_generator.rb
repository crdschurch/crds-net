module Jekyll
  class EnvGenerator < Generator
    attr_accessor :site

    def generate(site)

      @site = site
      @site.config['ENV'] = ENV.to_h
      @site.config['jekyll_env'] = ENV['JEKYLL_ENV'] || 'development'
      @site.config['imgix'] = {
        'find': ENV['IMGIX_SRC'],
        'replace': ENV['IMGIX_DOMAIN'],
      }
      @site.config['default_image'] = "//#{ENV['IMGIX_DOMAIN']}/images/type-bg.jpg"
      @site.config['crds_domain'] = "https://#{env_prefix}.crossroads.net"
      @site.config['search_domain'] = ENV['SEARCH_DOMAIN'] || 'https://www.crossroads.net'
      @site.config['url'] = ENV['SITE_URL'] if ENV['SITE_URL']
      @site.config['music_url'] = ENV['CRDS_MUSIC_ENDPOINT'] if ENV['CRDS_MUSIC_ENDPOINT']
    end

    private

      def env_prefix
        envs = {
          development: 'int',
          int: 'int',
          demo: 'demo',
          production: 'www',
        }
        envs[@site.config['jekyll_env'].to_sym]
      end

  end
end
