require 'httparty'
require 'colorize'
require 'csv'
require 'pry'

class Redirects
  include HTTParty
  base_uri 'cdn.contentful.com'

  def initialize
    @redirect_options = {
      query: {
        access_token: ENV['CONTENTFUL_ACCESS_TOKEN'],
        content_type: 'redirect',
        limit: 1000
      }
    }
  end

  def redirects
    JSON.parse(get_data(@redirect_options)).dig('items').collect { |item| item_attrs(item) }
  end

  def to_csv!(path = './redirects.csv', debug=true)
    rows = CSV.read(path)

    n = nil
    rows.find do |row|
      if row.first =~ /\*\*\*[^\*]*\*\*\*/
        n = rows.find_index(row)
      end
      
      if row.first =~/.ROCK_AUTH/ and ENV['CRDS_ENV'] == 'demo'
        row.first.gsub!('.ROCK_AUTH', '.ROCK_AUTH_DEV')
      end
    end

    if n.nil?
      n = (rows.length - 1)
    else
      rows.delete_at(n)
    end

    rows.insert(n, *redirects)

    File.write(path, rows.map(&:to_csv).join)
    if debug
      puts "\nWrote #{redirects.size} redirects from Contentful to #{path}"
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

    def get_data(options)
      self.class.get("/spaces/#{ENV['CONTENTFUL_SPACE_ID']}/environments/#{ENV['CONTENTFUL_ENV']}/entries", options)
    end
end
