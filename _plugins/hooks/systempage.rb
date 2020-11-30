require_relative '../../lib/utils/imgix_util'

require 'net/http'
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
      params = "?auto=format\&w=1200\&h=630\&fit=crop"
      field["image"]["url"] = ::Utils::ImgixUtil.convert_contentful_url(field["image"]["url"], params)
    end

    binarize_legacy_styles(field)
  }
  
  write_file(systemPages)
end
