Jekyll::Hooks.register :site, :after_init do |site|
  site.config['components_endpoint'] = "https://#{ENV['CRDS_COMPONENTS_ENDPOINT'] || "components.crossroads.net"}/dist"
  site.config['unified_components_endpoint'] = "#{ENV['CRDS_UNIFIED_COMPONENTS_DOMAIN'] || "unified-components.crossroads.net"}/dist/unified-components.js"
  site.config['use_unified_components'] = ENV['USE_UNIFIED_COMPONENTS'] == 'true'

  env = case ENV['JEKYLL_ENV']
    when 'int' then 'int'
    when 'demo' then 'demo'
    else 'prod'
  end

  site.config['components_root_url'] = ENV['CRDS_COMPONENTS_ROOT_URL'] unless ENV['CRDS_COMPONENTS_ROOT_URL'].nil?
  site.config['data_host'] = "https://#{ENV['CRDS_DATA_ENDPOINT'] || "crds-data.crossroads.net"}"
  site.config['data_file'] = "#{env}.json"
  site.config['site_url'] = ENV['SITE_URL']
end
