require 'open-uri'

Jekyll::Hooks.register(:site, :after_init) do |site|
    # Require baseurl config option.
    raise "Missing required config option: baseurl" if site.config['baseurl'].nil?
    baseurl = ENV["BASEURL"] ? ENV["BASEURL"] : "/"
    site.config['baseurl'] = baseurl
end
