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
      configure_shared_header
      configure_streamspot_credentials
    end

    private
      def configure_shared_header
        @site.config['shared_header'] = {
          "app" => File.join(ENV['CRDS_APP_CLIENT_ENDPOINT'] || "https://#{env_prefix}.crossroads.net", ""),
          "cms" => File.join(ENV['CRDS_CMS_SERVER_ENDPOINT'] || "https://#{env_prefix}.crossroads.net/proxy/content/", ""),
          "img" => "https://#{env_prefix}.crossroads.net/proxy/gateway/api/image/profile/",
          "prefix" => "#{env_prefix unless @site.config['env'] == 'production' }"
        }
      end

      def env_prefix
        ENVS[@site.config['jekyll_env'].to_sym]
      end

      def configure_streamspot_credentials
        @site.config['streamspotId'] = ENV['STREAMSPOT_ID']
        @site.config['streamspotKey'] = ENV['STREAMSPOT_API_KEY']
      end
  end
end
