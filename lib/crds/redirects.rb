require 'httparty'
require "csv"

class Redirects
  include HTTParty
  base_uri 'cdn.contentful.com'

  def initialize
    @options = {
      query: {
        access_token: ENV['CONTENTFUL_ACCESS_TOKEN'],
        content_type: 'redirects'
      }
    }
  end

  def redirects
    JSON.parse(get_redirects).dig('items').collect do |item|
      item.dig('fields').values
    end
  end

  def to_csv!
    rows = CSV.read('./redirects.csv')
    rows.insert(1, *redirects)
    File.write('./redirects.csv', rows.map(&:to_csv).join)
  end

  private

    def get_redirects
      self.class.get("/spaces/#{ENV['CONTENTFUL_SPACE_ID']}/environments/master/entries", @options)
    end

end