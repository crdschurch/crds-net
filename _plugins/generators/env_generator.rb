module Jekyll
  class EnvGenerator < Generator
    attr_accessor :site

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
        envs = {
          development: 'int',
          int: 'int',
          demo: 'demo',
          production: 'www',
        }
        envs[@site.config['jekyll_env'].to_sym]
      end

      def configure_streamspot_credentials
        if env_is_production?
          set_streamspot_credentials({id: 'crossr4915', key: '82437b4d-4e38-42e2-83b6-148fcfaf36fb'})
        else
          set_streamspot_credentials({id: 'crossr30e3', key: 'a0cb38cb-8146-47c2-b11f-6d93f4647389'})
        end
      end

      def env_is_production?
        @site.config['jekyll_env'] == 'production'
      end

      def set_streamspot_credentials(credentials)
        @site.config['streamspotId'] = credentials[:id]
        @site.config['streamspotKey'] = credentials[:key]
      end
  end
end
