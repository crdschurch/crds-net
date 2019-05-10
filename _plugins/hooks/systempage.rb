require 'net/http'
require 'json'
require 'pry'

Jekyll::Hooks.register :site, :post_write do |site|  
  systemPages = {
    'systemPages' => []
  }

  sys_page_docs = site.collections['system_pages'].docs
  
  sys_page_docs.each {|doc|
    systemPages['systemPages'] << doc.data
  }

  def binarize_legacy_styles(item)
    item['legacy_styles'] = item['legacy_styles'] ? 1 : 0
  end

  def imgixify(item)
    params = "?auto=format\&w=1200\&h=630\&fit=crop" # per FB's best practices for meta image
    item['image']['url'] = item['image']['url'].sub(/#{ENV['IMGIX_SRC']}/, ENV['IMGIX_DOMAIN']) + params
  end

  def write_file(data)
    File.open("_site/system-pages.json","w") do |f|
      f.write(data.to_json)
    end
  end

  systemPages['systemPages'].each {|field| 
    # remove excerpt data which causes infinite loop when writing json
    if field.include?('excerpt')
      field['excerpt'] = ''
    end

    if field.include?('image')
      imgixify(field)
    end

    binarize_legacy_styles(field)
  }
  
  write_file(systemPages)
end
