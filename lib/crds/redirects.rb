require 'httparty'
require 'colorize'
require 'csv'

class Redirects
  include HTTParty
  base_uri 'cdn.contentful.com'

  def initialize
    @options = {
      query: {
        access_token: ENV['CONTENTFUL_ACCESS_TOKEN'],
        content_type: 'redirect',
        limit: 1000
      }
    }
  end

  def redirects
    JSON.parse(get_redirects).dig('items').collect do |item|
      [
        item.dig('fields', 'from'),
        item.dig('fields', 'to'),
        "#{item.dig('fields', 'status_code') || 302}#{'!' if item.dig('fields', 'is_forced')}"
      ]
    end
  end

  def to_csv!(path = './redirects.csv')
    rows = CSV.read(path)
    rows.insert(2, *redirects)
    File.write(path, rows.map(&:to_csv).join)
    puts "\n + #{redirects.size} redirects from Contentful".colorize(:cyan)
  end

  private

    def get_redirects
      self.class.get("/spaces/#{ENV['CONTENTFUL_SPACE_ID']}/environments/#{ENV['CONTENTFUL_ENV']}/entries", @options)
    end
end
