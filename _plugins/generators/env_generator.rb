module Jekyll
  class EnvGenerator < Generator
    attr_accessor :site

    def generate(site)
      @site = site
      @site.config['jekyll_env'] = ENV['JEKYLL_ENV'] || 'development'
      @site.config['shared_header'] = {
        "app" => ENV['CRDS_APP_ENDPOINT'] || "https://#{env_prefix}.crossroads.net/",
        "cms" => ENV['CRDS_CMS_ENDPOINT'] || "https://#{env_prefix}.crossroads.net/proxy/content/",
        "img" => "https://#{env_prefix}.crossroads.net/proxy/gateway/api/image/profile/",
        "prefix" => "#{env_prefix unless @site.config['env'] == 'production' }"
      }
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