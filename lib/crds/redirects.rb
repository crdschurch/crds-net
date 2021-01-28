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

  def to_csv!(path = './redirects.csv', debug=true)
    rows = CSV.read(path)
    rows.insert(18, *redirects)
    rows.insert(18, *auth_required)
    File.write(path, rows.map(&:to_csv).join)
    if debug
      puts "\nWrote #{redirects.size + auth_required.size} redirects from Contentful to #{path}"
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

    def page_attrs(item)
      [
        URI.parse(item.dig('fields', 'permalink')).path,
        URI.parse(item.dig('fields', 'permalink')).path,
        '200! Role=user'
      ]
    end

    def login_attrs(item)
      uri = URI.parse(item.dig('fields', 'permalink'))
      ary = Array.new
      if uri && uri.query
        params = CGI.parse(uri.query)
        params.each do |key, value|
          puts "k: #{key}, v: #{value.first}"
          ary.push("#{key}=#{value.first}")
        end
      end
      [
        URI.parse(item.dig('fields', 'permalink')).path,
        *ary,
        "/signin?redirectUrl=#{item.dig('fields', 'permalink')}",
        '302!'
      ]
    end

    def get_data(options)
      self.class.get("/spaces/#{ENV['CONTENTFUL_SPACE_ID']}/environments/#{ENV['CONTENTFUL_ENV']}/entries", options)
    end
end
