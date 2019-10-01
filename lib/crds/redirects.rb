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

    @auth_required_options = {
      query: {
        access_token: ENV['CONTENTFUL_ACCESS_TOKEN'],
        content_type: 'page',
        'fields.requires_auth': true,
        limit: 1000
      }
    }
  end

  def redirects
    JSON.parse(get_data(@redirect_options)).dig('items').collect { |item| item_attrs(item) }
  end

  def auth_required
    auth_pages = JSON.parse(get_data(@auth_required_options))
    pages = auth_pages.dig('items').collect { |item| page_attrs(item) }
    logins = auth_pages.dig('items').collect { |item| login_attrs(item) }
    pages + logins
  end

  def to_csv!(path = './redirects.csv')
    rows = CSV.read(path)
    rows.insert(2, *redirects)
    rows.insert(2, *auth_required)
    File.write(path, rows.map(&:to_csv).join)
    puts "\n + #{redirects.size + auth_required.size} redirects from Contentful".colorize(:cyan)
  end

  private

    def item_attrs(item)
      [
        item.dig('fields', 'from'),
        item.dig('fields', 'to'),
        "#{item.dig('fields', 'status_code') || 302}#{'!' if item.dig('fields', 'is_forced')}"
      ]
    end

    def page_attrs(item)
      [
        item.dig('fields', 'permalink'),
        item.dig('fields', 'permalink'),
        '200! Role=user'
      ]
    end

    def login_attrs(item) 
      [
        item.dig('fields', 'permalink'),
        "/signin?redirectUrl=#{item.dig('fields', 'permalink')}",
        '302!'
      ]
    end

    def get_data(options)
      self.class.get("/spaces/#{ENV['CONTENTFUL_SPACE_ID']}/environments/#{ENV['CONTENTFUL_ENV']}/entries", options)
    end
end
