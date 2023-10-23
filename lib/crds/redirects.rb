require 'httparty'
require 'colorize'
require 'csv'
require 'pry'

class Redirects
  include HTTParty

  def initialize
    @redirect_options = {
      query: {
        access_token: ENV['CONTENTFUL_ACCESS_TOKEN'],
        content_type: 'redirect',
        limit: 1000
      }
    }

    @flex_page_options = {
      query: {
        access_token: ENV['CRDS_ENV'] == 'prod' ? ENV['CONTENTFUL_ACCESS_TOKEN'] : ENV['CONTENTFUL_PREVIEW_TOKEN'],
        content_type: 'flexPage',
        limit: 1000
      }
    }
  end

  def redirects
    JSON.parse(get_data(@redirect_options)).dig('items').collect { |item| item_attrs(item) }
  end

  def flex_page_redirects
    if ENV['CRDS_ENV'] == 'prod'
      data = JSON.parse(get_data(@flex_page_options)).dig('items')
    else
      data = JSON.parse(get_preview_data(@flex_page_options)).dig('items')
    end
  
    if data.nil? || data.empty?
      transformed = []
    else
      transformed = data.collect { |item| ["/#{flex_item_attrs(item)},${env:CRDS_UNIFIED_DOMAIN}#{flex_item_attrs(item)},200!"] }
    end
  end

  def to_csv!(path = './redirects.csv', debug = true)
    rows = CSV.read(path)
    n = nil
    rows.find do |row|
      if row.first =~ /\*\*\*[^\*]*\*\*\*/
        n = rows.find_index(row)
      end
    end

    rows.each do |row|
      if row.last.include? '.ROCK_AUTH' and ENV['CRDS_ENV'] == 'demo'
        row.last.gsub!('.ROCK_AUTH', '.ROCK_AUTH_DEV')
      end
    end

    if n.nil?
      n = (rows.length - 1)
    else
      rows.delete_at(n)
    end

    if flex_page_redirects.length != 0
      rows.insert(n, *flex_page_redirects)
      rows.insert(n + flex_page_redirects.length, *redirects)
    else
      rows.insert(n, *redirects)
    end

    all_rows = rows.map(&:to_csv).join.gsub('"', '')

    File.write(path, all_rows)
    if debug
      puts "\nWrote #{redirects.size} redirects and #{flex_page_redirects.size} flex page redirects to #{path}"
    end
  end

  private
    def item_attrs(item)
      [
        item.dig('fields', 'from'),
        item.dig('fields', 'to'),
        "#{item.dig('fields', 'status_code') || 302}#{'!' if item.dig('fields', 'is_forced')}"
      ]
    end

    def flex_item_attrs(item)
      item.dig('fields', 'slug')
    end

    def get_data(options)
      self.class.base_uri('cdn.contentful.com')
      self.class.get("/spaces/#{ENV['CONTENTFUL_SPACE_ID']}/environments/#{ENV['CONTENTFUL_ENV']}/entries", options)
    end

    def get_preview_data(options)
      self.class.base_uri('preview.contentful.com')
      self.class.get("/spaces/#{ENV['CONTENTFUL_SPACE_ID']}/environments/#{ENV['CONTENTFUL_ENV']}/entries", options)
    end
end
