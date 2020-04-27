Jekyll::Hooks.register :site, :after_init do |site|
  if ENV['NETLIFY']
    site.config['components_url'] = "/components"
  else
    site.config['components_url'] = "https://#{ENV['CRDS_COMPONENTS_ENDPOINT'] || "components-int.crossroads.net"}/dist"
  end
end