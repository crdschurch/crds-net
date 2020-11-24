Jekyll::Hooks.register :site, :after_init do |site|
    site.config['components_endpoint'] = "https://#{ENV['CRDS_COMPONENTS_ENDPOINT'] || "components-int.crossroads.net"}/dist"
    site.config['components_root_url'] = ENV['CRDS_COMPONENTS_ROOT_URL'] unless ENV['CRDS_COMPONENTS_ROOT_URL'].nil?
  
    env = case ENV['JEKYLL_ENV']
      when 'int' then 'int'
      when 'demo' then 'demo'
      else 'prod'
    end
  
    site.config['data_host'] = "https://#{ENV['CRDS_DATA_ENDPOINT'] || "crds-data.crossroads.net"}"
    site.config['data_file'] = "#{env}.json"
  end 
  