Jekyll::Hooks.register :documents, :post_render do |document|
  imgRegex = /https:\/\/images.ctfassets.net\/y3a9myzsdjan\/[\w\/\-_.]+.(png|jpg|jpeg)/

  def replace_with_imgix(url)
    if url.include?('images.ctfassets.net') && !url.include?('.gif') && !url.include?('.svg')
      imgix_url = url
        .sub('images.ctfassets.net/y3a9myzsdjan', 'crds-media.imgix.net')
        .concat('?auto=format,compress')

      imgix_url
    else
      url
    end
  end

  document.output = document.output.gsub(imgRegex) do |url|
    replace_with_imgix(url)
  end
end
