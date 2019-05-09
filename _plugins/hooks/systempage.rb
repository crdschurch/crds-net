require 'net/http'
require 'json'
require 'pry'

Jekyll::Hooks.register :site, :post_read do |site|  
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
    item['image']['url'] = item['image']['url'].sub(/#{ENV['IMGIX_SRC']}/, ENV['IMGIX_DOMAIN'])
    # per FB's best practices for meta image
    item['image']['url'] = "#{item['image']['url']}?auto=format\&w=1200\&h=630\&fit=crop"
  end

  def write_file(data)
    File.open("system-pages.json","w") do |f|
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
