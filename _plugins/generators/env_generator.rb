module Jekyll
  class EnvGenerator < Generator
    attr_accessor :site

    ENVS = {
      development: 'int',
      int: 'int',
      demo: 'demo',
      production: 'www',
    }

    def generate(site)
      @site = site
      @site.config['jekyll_env'] = ENV['JEKYLL_ENV'] || 'development'
      @site.config['gateway_server_endpoint'] = "https://gateway#{env_prefix}.crossroads.net/gateway/"
      @site.config['shared_header'] = {
        "app" => File.join(ENV['CRDS_APP_CLIENT_ENDPOINT'] || "https://#{env_prefix}.crossroads.net", ""),
        "cms" => File.join(ENV['CRDS_CMS_SERVER_ENDPOINT'] || "https://#{env_prefix}.crossroads.net/proxy/content/", ""),
        "img" => "https://#{env_prefix}.crossroads.net/proxy/gateway/api/image/profile/",
        "prefix" => "#{env_prefix unless @site.config['env'] == 'production' }"
      }
    end

    private

      def env_prefix
        ENVS[@site.config['jekyll_env'].to_sym]
      end

  end
end
