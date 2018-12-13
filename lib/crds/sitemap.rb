require 'httparty'
require 'colorize'
require 'pry'
require 'nokogiri'

class Sitemap

  def write!
    dir = File.expand_path(File.join(File.dirname(__FILE__), '../../_site'))
    FileUtils.mkdir_p(dir)
    File.open("#{dir}/sitemap.xml", 'w') do |file|
      file << doc.to_xml
    end
  end

  def doc
    ::Nokogiri::XML::Builder.new(:encoding => 'UTF-8')
  end

end