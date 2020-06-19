Jekyll::Hooks.register :site, :after_init do |site|
  if ENV['NETLIFY']
    site.config['components_endpoint'] = "/components"
  else
    site.config['components_endpoint'] = "https://#{ENV['CRDS_COMPONENTS_ENDPOINT'] || "components-int.crossroads.net"}/dist"
  end

  env = case ENV['JEKYLL_ENV']
    when 'int' then 'int'
    when 'demo' then 'demo'
    else 'prod'
  end

  site.config['components_root_url'] = ENV['CRDS_COMPONENTS_ROOT_URL'] unless ENV['CRDS_COMPONENTS_ROOT_URL'].nil?
  site.config['data_host'] = "https://#{ENV['CRDS_DATA_ENDPOINT'] || "crds-data.crossroads.net"}"
  site.config['data_file'] = "#{env}.json"
end