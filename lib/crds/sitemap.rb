require 'httparty'
require 'colorize'
require 'nokogiri'

class Sitemap

  def initialize
    @doc = Nokogiri::XML File.read("#{@base}/tmp/sitemap.xml")
    remote_docs.each do |doc|
      @doc.at('urlset').add_child(doc)
    end
  end

  def write!
    dir =
    FileUtils.mkdir_p(@base)
    File.open("#{@base}/sitemap.xml", 'w') do |file|
      file << @doc.to_xml
    end
  end

  def remote_docs
    [
      "https://media#{env_prefix}.crossroads.net/tmp/sitemap.xml"
    ].collect do |url|
      response = HTTParty.get(url, format: :xml)
      if response.found?
        doc = Nokogiri::XML(response.body)
        doc.search('url')
      end
    end.compact.flatten
  end

  def env_prefix
    ENV['JEKYLL_ENV'] unless ENV['JEKYLL_ENV'] == 'production'
  end

end