module Jekyll
  class EnvGenerator < Generator
    attr_accessor :site

    def generate(site)
      @site = site
      @site.config['jekyll_env'] = ENV['JEKYLL_ENV'] || 'development'
      @site.config['shared_header'] = {
        "app" => ENV['CRDS_APP_CLIENT_ENDPOINT'] || "https://#{env_prefix}.crossroads.net/",
        "cms" => ENV['CRDS_CMS_SERVER_ENDPOINT'] || "https://#{env_prefix}.crossroads.net/proxy/content/",
        "img" => "https://#{env_prefix}.crossroads.net/proxy/gateway/api/image/profile/",
        "prefix" => "#{env_prefix unless @site.config['env'] == 'production' }"
      }
      @site.config['imgix'] = {
        'find': ENV['IMGIX_SRC'],
        'replace': ENV['IMGIX_DOMAIN'],
      }
      @site.config['default_image'] = "//#{ENV['IMGIX_DOMAIN']}/default-image.jpg"
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
