# converts contentful cdn urls to imgix ones
# with the option to add some params for image manipulation
module Utils
  class ImgixUtil
    def self.convert_contentful_url(image_url, params)
      image_url = image_url.sub(/#{ENV['IMGIX_SRC']}/, ENV['IMGIX_DOMAIN']) + params
    end
  end
end
