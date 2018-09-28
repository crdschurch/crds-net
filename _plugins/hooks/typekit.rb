require 'open-uri'

Jekyll::Hooks.register(:site, :after_init) do |site|
  # Require typekit_url config option.
  raise "Missing required config option: typekit_url" if site.config['typekit_url'].nil?
  # Download CSS from TypeKit.
  fonts_css = open(site.config['typekit_url']) { |f| f.read }
  css_file = '_assets/stylesheets/_fonts.scss'
  # If CSS is different from what we currently have, write to the fonts partial.
  File.open(css_file, 'w+') { |f| f.write(fonts_css) } unless fonts_css == File.read(css_file)
end
