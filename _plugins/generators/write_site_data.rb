require 'json'

Jekyll::Hooks.register :site, :post_write do |site|
  File.open('site_data.json', 'w') do |f|
    f.write(JSON.pretty_generate(site.data))
  end
end